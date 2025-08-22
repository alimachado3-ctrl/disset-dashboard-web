// app/api/login/route.ts
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  const { user, pass } = await req.json();

  const U = process.env.AUTH_USER || "";
  const P = process.env.AUTH_PASS || "";
  const S = process.env.AUTH_SECRET || "";
  if (!S) return NextResponse.json({ error: "Missing AUTH_SECRET" }, { status: 500 });

  if (user !== U || pass !== P) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const secret = new TextEncoder().encode(S);
  const token = await new SignJWT({ u: user })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d") // duración de la sesión
    .sign(secret);

  const res = NextResponse.json({ ok: true });
  res.headers.set(
    "Set-Cookie",
    `auth=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
  );
  return res;
}
