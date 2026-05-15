import Google from "next-auth/providers/google";

export function getAuthConfig(env) {
  // Parsing Environment Variables
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const domainRegex = /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  const ALLOWED_DOMAINS = (env.ALLOWED_DOMAINS || "@apps.ipb.ac.id")
    .match(domainRegex)
    ?.map(d => d.trim().toLowerCase()) || ["@apps.ipb.ac.id"];

  const ADMIN_EMAILS = (env.ADMIN_EMAILS || "")
    .match(emailRegex)
    ?.map(e => e.trim().toLowerCase()) || [];

  const WHITELISTED_EMAILS = (env.WHITELISTED_EMAILS || "")
    .match(emailRegex)
    ?.map(e => e.trim().toLowerCase()) || [];

  return {
    providers: [
      Google({
        clientId: env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],

    pages: {
      signIn: "/login",
      error: "/login",
    },
    callbacks: {
      async signIn({ user, account, profile }) {
        // Pengecekan Domain Dinamis & Whitelist
        const userEmail = user.email?.toLowerCase() || "";
        const isAdmin = ADMIN_EMAILS.includes(userEmail);
        const isWhitelisted = WHITELISTED_EMAILS.includes(userEmail);
        const isAllowedDomain = ALLOWED_DOMAINS.some(domain => userEmail.endsWith(domain));

        // Jika domainnya tidak diizinkan DAN emailnya nggak ada di list whitelist/admin, TOLAK!
        if (!isAllowedDomain && !isAdmin && !isWhitelisted) {
          console.warn(`SIGNIN BLOCKED: [${userEmail}] is not in Allowed Domains or Whitelist.`);
          return false;
        }

        // Auto-Register ke D1 Database
        try {
          const { getDb } = await import("@/lib/db");
          const { users } = await import("@/db/schema");
          const { eq } = await import("drizzle-orm");

          const db = getDb(env);
          const userEmail = user.email?.toLowerCase();
          const existingUser = await db.select().from(users).where(eq(users.email, userEmail)).get();
          
          // EDGE CASE: Blocked User
          if (existingUser?.isBlocked) {
            console.warn(`LOGIN DENIED: User [${user.email}] is BLOCKED`);
            return false;
          }

          if (!existingUser) {
            const isManualAdmin = ADMIN_EMAILS.includes(userEmail);
            const initialRole = isManualAdmin ? "ADMIN" : "ONBOARDING";

            await db.insert(users).values({
              id: user.id || crypto.randomUUID(),
              name: user.name,
              email: userEmail,
              role: initialRole,
            }).run();
          }
        } catch (error) {
          console.error("Auto-register error", error);
        }
        return true;
      },
      async jwt({ token, user, trigger }) {
        const userEmail = (user?.email || token?.email)?.toLowerCase();
        
        // Cek apakah user ada di list ADMIN_EMAILS (Prioritas Tertinggi)
        const isHardcodedAdmin = userEmail && ADMIN_EMAILS.includes(userEmail);

        try {
          const { getDb } = await import("@/lib/db");
          const { users } = await import("@/db/schema");
          const { eq } = await import("drizzle-orm");

          const db = getDb(env);
          const dbUser = await db.select().from(users).where(eq(users.email, userEmail)).get();
          
          if (dbUser) {
            // 🚨 STRIKE: Jika diblokir, batalkan token (User ditendang otomatis)
            if (dbUser.isBlocked) {
              console.warn(`[AUTH] ACCESS REVOKED: User ${userEmail} is currently BLOCKED.`);
              return null; 
            }
            token.id = dbUser.id;
            
            // PRIORITAS ROLE SINKRONISASI:
            if (isHardcodedAdmin) {
              // Jika dia admin di .dev.vars tapi di DB bukan admin -> Paksa jadi ADMIN (dan diam-diam update DB biar sinkron)
              if (dbUser.role !== "ADMIN") {
                token.role = "ADMIN";
                db.update(users).set({ role: "ADMIN" }).where(eq(users.email, userEmail)).run().catch(e => console.error("Auto-Admin DB Update Error:", e));
              } else {
                token.role = "ADMIN";
              }
            } else {
              // Jika sebelumnya dia ADMIN di DB tapi sekarang dicopot dari list ADMIN_EMAILS di .dev.vars
              if (dbUser.role === "ADMIN") {
                const targetDemotedRole = dbUser.whatsappNumber ? "SELLER" : "BUYER";
                token.role = targetDemotedRole;
                // Diam-diam turunkan role di database agar sinkron
                db.update(users).set({ role: targetDemotedRole }).where(eq(users.email, userEmail)).run().catch(e => console.error("Admin Demotion DB Update Error:", e));
              } else {
                // Jika bukan admin, percayakan role sepenuhnya dari Database
                token.role = dbUser.role;
              }
            }
          } else if (user) {
            token.id = user.id;
            token.role = isHardcodedAdmin ? "ADMIN" : "ONBOARDING";
          } else {
            // 🚨 STRIKE: User tidak ditemukan di DB dan ini bukan login baru (User telah dihapus!)
            console.warn(`[AUTH] ACCESS REVOKED: User ${userEmail} was deleted from database.`);
            return null; // Batalkan token (User ditendang otomatis)
          }
        } catch (e) {
          console.error("[AUTH] JWT Sync Error:", e);
          // Fallback darurat
          if (isHardcodedAdmin) token.role = "ADMIN";
        }

        if (!token.role) token.role = "ONBOARDING";
        return token;
      },

      async session({ session, token }) {
        if (session.user) {
          session.user.role = token.role;
          session.user.id = token.id;
        }
        return session;
      }
    },
    debug: true,
    trustHost: true,
    secret: env.AUTH_SECRET || process.env.AUTH_SECRET,
    
    // 🌐 ENVIRONMENT-AWARE COOKIE POLICY
    // Memastikan session aman di Production (HTTPS) tapi tetap jalan di Local/Docker (HTTP)
    useSecureCookies: env.NODE_ENV === "production" || !!env.CF_PAGES,
  };
}

/**
 * Helper to get NextAuth 'auth' object within Server Actions (Edge compatible)
 */
export async function getAuth() {
  // @ts-ignore
  const { getRequestContext } = await import("@cloudflare/next-on-pages");
  const NextAuth = (await import("next-auth")).default;
  
  let env = process.env;
  try {
    const ctx = getRequestContext();
    if (ctx?.env) env = { ...env, ...ctx.env };
  } catch (e) {}

  return NextAuth(getAuthConfig(env)).auth;
}

