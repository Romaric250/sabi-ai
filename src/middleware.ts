import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import type { Session } from "@/lib/auth";

const authRoutes = ["/auth/sign-in", "/auth/sign-up"];
const passwordRoutes = ["/auth/reset-password", "/auth/forgot-password"];

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const isAuthRoute = authRoutes.includes(pathName);
  const isPasswordRoute = passwordRoutes.includes(pathName);

  try {
    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!session) {
      if (isAuthRoute || isPasswordRoute) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    if (isAuthRoute || isPasswordRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    if (isAuthRoute || isPasswordRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
