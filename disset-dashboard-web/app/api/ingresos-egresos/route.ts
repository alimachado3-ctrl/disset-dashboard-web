// disset-dashboard-web/app/api/ingresos-egresos/route.ts
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase";

function applyFilters(q: any, p: URLSearchParams) {
  const year = p.get("year");
  const property = p.get("property");
  const advisor = p.get("advisor");
  const category = p.get("category");
  const subcategory = p.get("subcategory");
  const type = p.get("type");

  if (year) {
    q.gte("date", `${year}-01-01`).lt("date", `${Number(year) + 1}-01-01`);
  }
  if (property) q.eq("property", property);
  if (advisor) q.eq("advisor", advisor);
  if (category) q.eq("category", category);
  if (subcategory) q.eq("subcategory", subcategory);
  if (type) q.eq("type", type);

  return q;
}

const ym = (d: string) => {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  return `${m}/${y}`; // igual a lo que ya ves en tus vistas
};

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;

  let q = supabaseService
    .from("movements")
    .select("date, type, amount, property, advisor, category, subcategory")
    .range(0, 99999);

  q = applyFilters(q, params);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const map = new Map<string, { ingresos: number; egresos: number }>();
  for (const r of data ?? []) {
    const key = ym(r.date);
    const acc = map.get(key) || { ingresos: 0, egresos: 0 };
    if ((r.type || "").toLowerCase() === "ingreso") acc.ingresos += Number(r.amount || 0);
    else if ((r.type || "").toLowerCase() === "egreso") acc.egresos += Number(r.amount || 0);
    map.set(key, acc);
  }

  const out = Array.from(map.entries())
    .sort(([a], [b]) => {
      const [ma, ya] = a.split("/").map(Number);
      const [mb, yb] = b.split("/").map(Number);
      return ya - yb || ma - mb;
    })
    .map(([periodo, v]) => ({ periodo, ...v }));

  return NextResponse.json(out);
}
