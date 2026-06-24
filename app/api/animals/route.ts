import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/auth";

export async function GET() {
  const { error } = await requireAuth();

  if (error) {
    return error;
  }

  const { data, error: dbError } = await supabaseAdmin
    .from("animals")
    .select("*")
    .order("id", { ascending: false });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
