import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decode } from "next-auth/jwt";

/**
 * MIDDLEWARE HARDENING (Edge Compatible)
 * --------------------------------------
 * Fokus: 
 * 1. RBAC (Role Based Access Control) di level Edge.
 * 2. Proteksi Admin & Seller area.
 * 3. Security Headers (Harden).
 */

const SECRET = process.env.AUTH_SECRET;

export default async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const res = NextResponse.next();

  // 1. SECURITY HEADERS (Hardening)
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // 2. PATH IDENTIFICATION
  const path = nextUrl.pathname;
  
  const isLoginPage = path === '/login';
  const isPublicPage = path === '/';
  const isApiAuth = path.startsWith('/api/auth');
  const isPublicFile = path.match(/\.(png|jpg|jpeg|svg|gif|webp|ico)$/);
  const isNextInternal = path.startsWith('/_next') || req.headers.has('x-nextjs-data');
  const isServerAction = req.headers.has('next-action');

  // Skip middleware for public assets, auth APIs, Next.js internal requests, and Server Actions
  if (isPublicFile || isApiAuth || isNextInternal || isServerAction) return res;

  // 3. SESSION VERIFICATION (Multi-variant check for local/prod compatibility)
  const hasToken = cookies.get("authjs.session-token") || 
                   cookies.get("__Secure-authjs.session-token") ||
                   cookies.get("next-auth.session-token") ||
                   cookies.get("__Secure-next-auth.session-token");
  
  const sessionToken = hasToken?.value;

  // 4. RBAC LOGIC
  if (!sessionToken) {
    // Jika tidak ada session dan mencoba akses area terproteksi
    if (!isLoginPage && !isPublicPage) {
      console.log(`[Middleware] Unauthorized access to ${path}, redirecting to /login`);
      return NextResponse.redirect(new URL('/login', nextUrl));
    }
    return res;
  }

  try {
    // Decode token tanpa verifikasi signature (karena verifikasi butuh crypto keys yang kompleks di Edge)
    // TAPI kita bisa pakai 'decode' dari next-auth/jwt yang aman di Edge.
    // NOTE: decode() di v5 butuh secret untuk decrypt JWE.
    const decoded = await decode({
      token: sessionToken,
      secret: SECRET!,
      salt: hasToken.name, // Gunakan nama cookie yang beneran ketemu sebagai salt
    });

    if (!decoded) {
      if (!isLoginPage && !isPublicPage) {
        return NextResponse.redirect(new URL('/login', nextUrl));
      }
      return res;
    }

    const role = (decoded.role as string) || "ONBOARDING";
    
    // GUARD: Jika user mencoba masuk ke halaman login padahal sudah punya session
    if (isLoginPage) {
      if (role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', nextUrl));
      }
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }

    // GUARD: Admin Area
    if (path.startsWith('/admin') && role !== 'ADMIN') {
      console.warn(`[Middleware] Forbidden: User ${decoded.email} tried to access Admin area.`);
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }

    // GUARD: Seller Dashboard & Seller Area (Dashboard, Product Add/Edit/Detail, Profile)
    const isSellerPath = path.startsWith('/dashboard') || 
                         path === '/product/add' || 
                         path.startsWith('/product/edit') || 
                         path.startsWith('/product/detail') || 
                         path.startsWith('/profile');

    if (isSellerPath) {
      if (role === 'ONBOARDING') {
        return NextResponse.redirect(new URL('/onboarding', nextUrl));
      }
      if (role === 'ADMIN') {
        if (path.startsWith('/dashboard')) {
          return NextResponse.redirect(new URL('/admin/dashboard', nextUrl));
        }
      }
      if (role === 'BUYER') {
        console.warn(`[Middleware] Forbidden: Buyer ${decoded.email} tried to access Seller area.`);
        return NextResponse.redirect(new URL('/', nextUrl)); // Redirect to public home
      }
    }

    // GUARD: Onboarding Loop (Jika sudah punya role tapi balik ke onboarding)
    if (path === '/onboarding' && role !== 'ONBOARDING') {
      if (role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', nextUrl));
      }
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }

  } catch (error) {
    console.error("[Middleware Error]:", error);
    // Jika token corrupt atau expired, biarkan user ke login
    if (!isLoginPage && !isPublicPage) {
      return NextResponse.redirect(new URL('/login', nextUrl));
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
