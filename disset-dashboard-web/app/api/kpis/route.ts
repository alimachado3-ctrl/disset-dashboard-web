// disset-dashboard-web/app/api/kpis/route.ts
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

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  let q = supabaseService
    .from("movements")
    .select("type, amount, date, property, advisor, category, subcategory")
    .range(0, 99999);

  q = applyFilters(q, params);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let ingresos = 0, egresos = 0;
  for (const r of data ?? []) {
    if ((r.type || "").toLowerCase() === "ingreso") ingresos += Number(r.amount || 0);
    else if ((r.type || "").toLowerCase() === "egreso") egresos += Number(r.amount || 0);
  }

  const payload = [
    { label: "Ingresos", value: ingresos },
    { label: "Egresos", value: egresos },
    { label: "Resultado Neto", value: ingresos - egresos },
  ];
  return NextResponse.json(payload);
}
