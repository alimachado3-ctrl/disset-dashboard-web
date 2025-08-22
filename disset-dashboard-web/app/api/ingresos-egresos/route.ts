
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabaseService
    .from("vw_ingresos_egresos_mensual")
    .select("*")
    .order("periodo");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
