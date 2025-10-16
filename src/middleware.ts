import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import type { Session } from "@/lib/auth";

const authRoutes = ["/auth/sign-in", "/auth/sign-up"];
const passwordRoutes = ["/auth/reset-password", "/auth/forgot-password"];
const publicRoutes = ["/", "/roadmap"]; // Allow landing page and roadmap page without auth

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const isAuthRoute = authRoutes.includes(pathName);
  const isPasswordRoute = passwordRoutes.includes(pathName);
  const isPublicRoute = publicRoutes.includes(pathName);

  // Allow public routes without authentication
  if (isPublicRoute) {
    return NextResponse.next();
  }

  try {
    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://sabi-ai-orcin.vercel.app",
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!session) {
      if (isAuthRoute || isPasswordRoute) {
        return NextResponse.next();
      }
      // Redirect to sign-in only for protected routes
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    if (isAuthRoute || isPasswordRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    if (isAuthRoute || isPasswordRoute || isPublicRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
