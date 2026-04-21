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
