// disset-dashboard-web/app/api/portales-mensual/route.ts
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

  // tipo egreso
  q.eq("type", "Egreso");
  return q;
}

const ym = (d: string) => {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  return `${m}/${y}`;
};

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;

  let q = supabaseService
    .from("movements")
    .select("date, type, amount, category, subcategory, description, property, advisor")
    .range(0, 99999);

  q = applyFilters(q, params);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const map = new Map<string, number>();
  for (const r of data ?? []) {
    const text = (
      (r.category || "") +
      " " +
      (r.subcategory || "") +
      " " +
      (r.description || "")
    ).toLowerCase();

    if (text.includes("portal")) {
      const key = ym(r.date);
      map.set(key, (map.get(key) || 0) + Number(r.amount || 0));
    }
  }

  const out = Array.from(map.entries())
    .sort(([a], [b]) => {
      const [ma, ya] = a.split("/").map(Number);
      const [mb, yb] = b.split("/").map(Number);
      return ya - yb || ma - mb;
    })
    .map(([periodo, total_egresos_portales]) => ({ periodo, total_egresos_portales }));

  return NextResponse.json(out);
}
