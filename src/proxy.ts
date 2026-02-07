import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { COOKIES_SESSION_NAME } from "./features/auth/constants";

//1. Specify protected routes and public routes
const protectedRoutes = ["/workspace"];
const publicRoutes = ["/", "/sign-in", "/sign-up"];

export default async function proxy(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtected = protectedRoutes.includes(path);
  const isPublic = publicRoutes.includes(path);

  const session = (await cookies()).get(COOKIES_SESSION_NAME);

  // 3. Redirect to /sign-in if user is not authenticated
  if (isProtected && (!session || !session.value)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // 4. Redirect to /workspace if user is authenticated
  if (
    isPublic &&
    session &&
    !req.nextUrl.pathname.startsWith("/workspace") &&
    path !== "/"
  ) {
    return NextResponse.redirect(new URL("/workspace", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.svg$|favicon.ico|.*\\.json$).*)",
  ],
};
