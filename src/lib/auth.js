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
      async jwt({ token, user }) {
        const userEmail = (user?.email || token?.email)?.toLowerCase();
        
        // Cek Role Admin dari Env List (Prioritas Utama untuk Testing)
        if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
          token.role = "ADMIN";
        }

        if (user) {
          try {
            const { getDb } = await import("@/lib/db");
            const { users } = await import("@/db/schema");
            const { eq } = await import("drizzle-orm");

            const db = getDb(env);
            const dbUser = await db.select().from(users).where(eq(users.email, user.email)).get();
            
            // PRIORITAS: Selalu gunakan ID dari Database (Single Source of Truth)
            // agar sinkron dengan tabel products, wishlists, dll.
            if (dbUser) {
              token.id = dbUser.id;
              if (!token.role) token.role = dbUser.role;
            } else {
              // Fallback jika user benar-benar baru (sedang proses sign-in)
              token.id = user.id;
              token.role = "ONBOARDING";
            }
          } catch (e) {
            console.error("JWT Callback Error:", e);
            if (!token.role) token.role = "ONBOARDING";
          }
        }
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
    debug: true, // NYALAKAN INI UNTUK LIHAT ERROR DI TERMINAL
    trustHost: true,
    secret: env.AUTH_SECRET || process.env.AUTH_SECRET,
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

