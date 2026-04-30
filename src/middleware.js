import { NextResponse } from "next/server";

// MODULER MIDDLEWARE: Tanpa Library NextAuth
// Karena NextAuth v5 sering crash di Cloudflare Middleware (error async_hooks),
// kita pakai cara manual yang jauh lebih stabil buat personal testing.
export default function middleware(req) {
  const { nextUrl, cookies } = req;
  
  // Ambil token dari cookie (NextAuth v5 default name)
  const hasToken = cookies.get("authjs.session-token") || 
                   cookies.get("__Secure-authjs.session-token");

  const isLoginPage = nextUrl.pathname === '/login';
  const isPublicPage = nextUrl.pathname === '/';
  
  const isPublicFile = nextUrl.pathname.startsWith('/_next') || 
                       nextUrl.pathname.includes('/api/auth') ||
                       nextUrl.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico)$/);

  // 1. Biarkan akses ke halaman login, halaman publik, atau file publik
  if (isLoginPage || isPublicPage || isPublicFile) {
    return NextResponse.next();
  }

  // 2. Jika tidak ada token, paksa redirect ke /login untuk rute terproteksi (Dashboard/Admin)
  if (!hasToken) {
    console.log(`[Middleware Strict] Unauthorized access to ${nextUrl.pathname}, redirecting to /login`);
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};

