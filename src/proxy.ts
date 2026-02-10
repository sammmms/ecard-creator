import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const authPages = ["/login", "/register"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Authenticated users should not access auth pages
  if (authPages.includes(pathname) && token?.sub) {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  // Unauthenticated users cannot access dashboard
  if (pathname.startsWith("/app") && !token?.sub) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Protect dashboard routes + redirect auth pages
export const config = {
  matcher: ["/app/:path*", "/login", "/register"],
};
