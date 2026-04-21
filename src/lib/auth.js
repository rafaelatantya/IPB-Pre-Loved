import Google from "next-auth/providers/google";

// MANUAL ADMIN LIST (Initial Testing Phase)
const ADMIN_EMAILS = [
  "rafaelatantya@apps.ipb.ac.id",
  // Masukkan email admin lainnya di sini
];

export function getAuthConfig(env) {
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
        // Pengecekan Domain Wajib IPB
        if (!user.email?.endsWith("@apps.ipb.ac.id")) {
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
            // Cek apakah email ini masuk ke list ADMIN manual
            const initialRole = ADMIN_EMAILS.includes(user.email) ? "ADMIN" : "BUYER";

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
      async jwt({ token, user, trigger, session }) {
        const userEmail = (user?.email || token?.email)?.toLowerCase();
        
        // PRIORITAS UTAMA: Manual Admin List (Hardcoded Bypass)
        // Ini dicek setiap kali token diakses, jadi perubahan list Admin langsung kerasa tanpa relogin.
        if (userEmail && ADMIN_EMAILS.some(email => email.toLowerCase() === userEmail)) {
          token.role = "ADMIN";
        }

        if (user) {
          // Hanya jalan pas Sign In pertama kali
          try {
            const { getDb } = await import("@/lib/db");
            const { users } = await import("@/db/schema");
            const { eq } = await import("drizzle-orm");

            const db = getDb(env);
            const dbUser = await db.select().from(users).where(eq(users.email, user.email)).get();
            
            if (!token.role) { // Jika belum di-set oleh manual list
              token.role = dbUser?.role || "BUYER";
            }
            token.id = user.id || dbUser?.id;
          } catch (e) {
            if (!token.role) token.role = "BUYER";
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
    trustHost: true,
    secret: env.AUTH_SECRET || process.env.AUTH_SECRET,
  };
}

