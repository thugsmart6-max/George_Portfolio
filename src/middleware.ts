import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "wc_session";

/** Set PUBLIC_AUTH_ENABLED=true in .env.local to reopen login/dashboard. */
const AUTH_PUBLIC = process.env.PUBLIC_AUTH_ENABLED === "true";

const protectedPrefixes = [
  "/dashboard",
  "/profile",
  "/finance",
  "/goals",
  "/coach",
  "/onboarding",
  "/settings",
  "/wealth-map",
];

const authPages = ["/login", "/register", "/forgot-password", "/reset-password"];

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

async function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const secret = getSecret();
  if (!token || !secret) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  const isAuthPage = authPages.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  // Brand-site mode: hide private workspace from the public
  if (!AUTH_PUBLIC && (isProtected || isAuthPage)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const authed = await isAuthenticated(request);

  if (isProtected && !authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/finance/:path*",
    "/goals/:path*",
    "/coach/:path*",
    "/onboarding/:path*",
    "/settings/:path*",
    "/wealth-map/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
