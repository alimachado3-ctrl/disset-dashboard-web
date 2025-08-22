import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const allowList = ["/login", "/api/login", "/api/logout"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Permitir assets estáticos siempre
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/assets")
  ) return NextResponse.next();

  // Permitir login/logout
  if (allowList.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const token = req.cookies.get("auth")?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) {
    return needAuth(req);
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch {
    return needAuth(req);
  }
}

function needAuth(req: NextRequest) {
  // Si es API (y no está en allowList), 401
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  // Si es página, redirigir a /login
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|login|api/login|api/logout).*)"],
};
