// app/api/filtros/route.ts
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabaseService
    .from("movements")
    .select("date, property, advisor, category, subcategory, type")
    .range(0, 99999);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const years = new Set<number>();
  const props = new Set<string>();
  const advisors = new Set<string>();
  const cats = new Set<string>();
  const subcats = new Set<string>();
  const types = new Set<string>();

  for (const r of data ?? []) {
    if (r.date) years.add(new Date(r.date).getFullYear());
    if (r.property) props.add(String(r.property));
    if (r.advisor) advisors.add(String(r.advisor));
    if (r.category) cats.add(String(r.category));
    if (r.subcategory) subcats.add(String(r.subcategory));
    if (r.type) types.add(String(r.type));
  }

  const sortStr = (a: string, b: string) => a.localeCompare(b, "es");
  const sortNumDesc = (a: number, b: number) => b - a;

  return NextResponse.json({
    years: Array.from(years).sort(sortNumDesc),
    properties: Array.from(props).sort(sortStr),
    advisors: Array.from(advisors).sort(sortStr),
    categories: Array.from(cats).sort(sortStr),
    subcategories: Array.from(subcats).sort(sortStr),
    types: Array.from(types).sort(sortStr),
  });
}
