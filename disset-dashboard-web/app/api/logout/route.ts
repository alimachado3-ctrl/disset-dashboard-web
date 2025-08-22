// app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const res = NextResponse.redirect(new URL("/login", request.url));
  res.headers.set("Set-Cookie", "auth=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0");
  return res;
}

export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL("/login", request.url));
  res.headers.set("Set-Cookie", "auth=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0");
  return res;
}
