
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabaseService.rpc("kpis_basicos");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
