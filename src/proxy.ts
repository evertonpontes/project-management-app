import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_AUTH_SESSION } from "./features/auth/config";

// specifying protected and public routes
const protectedRoutes = /^\/workspaces(\/.*)?$/;
const publicRoutes = ["/", "/login", "/sign-up"];

export default async function proxy(req: NextRequest) {
  // get if current path is public or protected
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);
  const isProtectedRoute = protectedRoutes.test(path);

  // getting session string from cookies
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_AUTH_SESSION);

  // redirect to '/login' if user is not authenticated
  if (isProtectedRoute && !session?.value) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // redirect to '/workspaces' if user is authenticated
  if (isPublicRoute && session?.value && path !== "/") {
    return NextResponse.redirect(new URL("/workspaces", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
