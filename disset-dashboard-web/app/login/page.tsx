"use client";
import { useState } from "react";

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, pass })
    });
    if (res.ok) {
      window.location.href = "/";
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j?.error || "Error de autenticación");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 w-full max-w-sm grid gap-4">
        <h1 className="text-lg font-semibold text-center">Acceso al Dashboard</h1>
        <input
          className="border rounded-lg p-2"
          placeholder="Usuario"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          type="password"
          className="border rounded-lg p-2"
          placeholder="Contraseña"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <button className="bg-black text-white rounded-lg p-2 hover:opacity-90" type="submit">
          Ingresar
        </button>
      </form>
    </main>
  );
}
