// disset-dashboard-web/app/api/egresos-por-categoria/route.ts
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase";

function applyFilters(q: any, p: URLSearchParams) {
  const year = p.get("year");
  const property = p.get("property");
  const advisor = p.get("advisor");
  const category = p.get("category");
  const subcategory = p.get("subcategory");

  if (year) q.gte("date", `${year}-01-01`).lt("date", `${Number(year) + 1}-01-01`);
  if (property) q.eq("property", property);
  if (advisor) q.eq("advisor", advisor);
  if (category) q.eq("category", category);
  if (subcategory) q.eq("subcategory", subcategory);

  // Fijamos tipo egreso
  q.eq("type", "Egreso");
  return q;
}

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;

  let q = supabaseService
    .from("movements")
    .select("category, amount, date, property, advisor, subcategory, type")
    .range(0, 99999);

  q = applyFilters(q, params);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const map = new Map<string, number>();
  for (const r of data ?? []) {
    const key = r.category || "(Sin categoría)";
    map.set(key, (map.get(key) || 0) + Number(r.amount || 0));
  }

  const out = Array.from(map.entries())
    .map(([category, monto]) => ({ category, monto }))
    .sort((a, b) => b.monto - a.monto);

  return NextResponse.json(out);
}
