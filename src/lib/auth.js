import Google from "next-auth/providers/google";

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
    },
    callbacks: {
      async signIn({ user, account, profile }) {
        // Pengecekan Domain Wajib IPB
        if (!user.email?.endsWith("@apps.ipb.ac.id")) {
          return false;
        }
        
        // Auto-Register ke D1 Database
        try {
          const { getDb } = await import("./db");
          const { users } = await import("../db/schema");
          const { eq } = await import("drizzle-orm");
          
          const db = getDb(env);
          const existingUser = await db.select().from(users).where(eq(users.email, user.email)).get();
          
          if (!existingUser) {
            await db.insert(users).values({
              id: user.id || crypto.randomUUID(),
              name: user.name,
              email: user.email,
              role: "BUYER", // Default Role
            });
          }
        } catch (error) {
          console.error("Auto-register error", error);
          // Bila DB error saat login pertama, boleh ditolak atau di log saja.
          // Kita biarkan true agar user bisa akses dan coba diregister di tempat lain bila perlu.
        }
        return true;
      },
      async jwt({ token, user }) {
        if (user) {
          try {
            const { getDb } = await import("./db");
            const { users } = await import("../db/schema");
            const { eq } = await import("drizzle-orm");
            
            const db = getDb(env);
            const dbUser = await db.select().from(users).where(eq(users.email, user.email)).get();
            if (dbUser) {
              token.role = dbUser.role;
              token.id = dbUser.id;
            } else {
              token.role = "BUYER";
            }
          } catch(e) {
            token.role = "BUYER";
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
