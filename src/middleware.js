import { NextResponse } from "next/server";

// MODULER MIDDLEWARE: Tanpa Library NextAuth
// Karena NextAuth v5 sering crash di Cloudflare Middleware (error async_hooks),
// kita pakai cara manual yang jauh lebih stabil buat personal testing.
export default function middleware(req) {
  const { nextUrl, cookies } = req;
  
  // Ambil token dari cookie (NextAuth v5 default name)
  const hasToken = cookies.get("authjs.session-token") || 
                   cookies.get("__Secure-authjs.session-token");

  console.log(`[Middleware Lite] Path: ${nextUrl.pathname} | HasToken: ${!!hasToken}`);

  const isSellerRoute = nextUrl.pathname.startsWith('/seller');
  const isAdminRoute = nextUrl.pathname.startsWith('/admin');

  // Proteksi Route Seller (Sifatnya mendinginkan, logic detail ada di Page)
  if (isSellerRoute && !hasToken) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  // Proteksi Route Admin
  // Kita bebaskan /admin-test agar kamu bisa masuk buat testing
  if (isAdminRoute && nextUrl.pathname !== '/admin-test' && !hasToken) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

