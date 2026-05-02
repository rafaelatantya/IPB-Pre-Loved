import Google from "next-auth/providers/google";

export function getAuthConfig(env) {
  // Parsing Environment Variables
  const ALLOWED_DOMAINS = (env.ALLOWED_DOMAINS || "@apps.ipb.ac.id").split(",").map(d => d.trim().toLowerCase());
  const ADMIN_EMAILS = (env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());

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
        // Pengecekan Domain Dinamis (Default: @apps.ipb.ac.id)
        const userEmail = user.email?.toLowerCase();
        const isAllowed = ALLOWED_DOMAINS.some(domain => userEmail?.endsWith(domain));

        if (!isAllowed) {
          console.warn(`SIGNIN BLOCKED: Domain [${userEmail}] not in [${ALLOWED_DOMAINS.join(", ")}]`);
          return false;
        }

        // Auto-Register ke D1 Database
        try {
          const { getDb } = await import("@/lib/db");
          const { users } = await import("@/db/schema");
          const { eq } = await import("drizzle-orm");

          const db = getDb(env);
          const existingUser = await db.select().from(users).where(eq(users.email, user.email)).get();
          
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
              email: user.email,
              role: initialRole,
            });
          }
        } catch (error) {
          console.error("Auto-register error", error);
        }
        return true;
      },
      async jwt({ token, user, trigger }) {
        const userEmail = (user?.email || token?.email)?.toLowerCase();
        
        // Cek Role Admin dari Env List (Prioritas Utama untuk Testing)
        if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
          token.role = "ADMIN";
        }

        // KUNCI PERBAIKAN: 
        // Kita sinkronisasi dengan database secara proaktif untuk mendeteksi BAN real-time.
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
            token.role = dbUser.role;
            // console.log(`[AUTH] JWT Sync: ${userEmail} role is now ${dbUser.role}`);
          } else if (user) {
            token.id = user.id;
            token.role = "ONBOARDING";
          }
        } catch (e) {
          console.error("[AUTH] JWT Sync Error:", e);
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
    
    // KUNCI PERBAIKAN: Paksa kebijakan cookie agar ramah Docker/Local
    cookies: {
      pkceCodeVerifier: {
        name: "authjs.pkce.code_verifier",
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: false, // Wajib false untuk http://localhost
        },
      },
    },
  };
}

/**
 * Helper to get NextAuth 'auth' object within Server Actions (Edge compatible)
 */
export async function getAuth() {
  const { getRequestContext } = await import("@cloudflare/next-on-pages");
  const NextAuth = (await import("next-auth")).default;
  
  let env = process.env;
  try {
    const ctx = getRequestContext();
    if (ctx?.env) env = { ...env, ...ctx.env };
  } catch (e) {}

  return NextAuth(getAuthConfig(env)).auth;
}

