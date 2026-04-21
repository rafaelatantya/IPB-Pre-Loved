import NextAuth from "next-auth";
import { getAuthConfig } from "@/lib/auth";

// In middleware, standard process.env is usually sufficient because NextAuth 
// mainly uses AUTH_SECRET from here to decode the JWT cookie.
// D1 Database callbacks code wouldn't be triggered by simple middleware session checks
const { auth } = NextAuth(getAuthConfig(process.env));

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user;

  const isSellerRoute = nextUrl.pathname.startsWith('/seller');
  const isAdminRoute = nextUrl.pathname.startsWith('/admin');

  // Proteksi Route Seller
  if (isSellerRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL('/api/auth/signin', nextUrl));
    }
    if (user?.role !== 'SELLER' && user?.role !== 'ADMIN') {
      return Response.redirect(new URL('/', nextUrl));
    }
  }

  // Proteksi Route Admin
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL('/api/auth/signin', nextUrl));
    }
    if (user?.role !== 'ADMIN') {
      return Response.redirect(new URL('/', nextUrl));
    }
  }
});

// Hanya match untuk validasi halaman (exclude resource / statics)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
