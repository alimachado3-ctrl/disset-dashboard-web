// app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost"));
  res.headers.set("Set-Cookie", "auth=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0");
  return res;
}

export async function POST() {
  const res = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost"));
  res.headers.set("Set-Cookie", "auth=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0");
  return res;
}
