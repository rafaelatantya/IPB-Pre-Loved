import NextAuth from "next-auth";
import { getAuthConfig } from "@/lib/auth";

export const runtime = "edge";

// Helper hook to inject Cloudflare bindings to NextAuth configuration
const createHandler = () => {
  return async (req) => {
    let env = process.env;
    try {
      const { getRequestContext } = await import("@cloudflare/next-on-pages");
      const ctx = getRequestContext();
      if (ctx?.env) env = { ...env, ...ctx.env };
    } catch (e) {
      // Falback if getRequestContext fails (e.g. during simple local build steps)
    }

    // 🚀 DYNAMIC AUTH_URL INJECTION
    // Memaksa NextAuth menggunakan URL dinamis sesuai asalnya (Localhost vs Ngrok vs Production)
    // Sekaligus nge-fix bug Cloudflare yang ngilangin header 'https://' dari Ngrok
    const host = req.headers.get("host") || req.headers.get("x-forwarded-host") || "";
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      env.AUTH_URL = `http://${host}`;
      process.env.AUTH_URL = `http://${host}`;
    } else if (host) {
      // Semua domain selain localhost (termasuk ngrok, pages.dev, my.id) wajib pakai HTTPS
      env.AUTH_URL = `https://${host}`;
      process.env.AUTH_URL = `https://${host}`;
    }

    const { handlers } = NextAuth(getAuthConfig(env));
    
    // We recreate req if we want, but NextAuth can natively take NextRequest.
    if (req.method === 'GET') {
      return handlers.GET(req);
    }
    return handlers.POST(req);
  };
};

const handler = createHandler();

export { handler as GET, handler as POST };
