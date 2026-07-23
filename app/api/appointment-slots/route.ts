import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.json(
      { configured: false, slots: [] },
      { headers: { "cache-control": "no-store" } },
    );
  }

  const requestedDate = new URL(request.url).searchParams.get("date");

  if (!requestedDate || !/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
    return NextResponse.json(
      { configured: true, slots: [] },
      { headers: { "cache-control": "no-store" } },
    );
  }

  const supabase = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  const { data, error } = await supabase
    .from("appointment_slots")
    .select("id, slot_date, slot_time, note")
    .eq("slot_date", requestedDate)
    .order("slot_time", { ascending: true });

  if (error) {
    return NextResponse.json(
      { configured: true, slots: [], error: error.message },
      { headers: { "cache-control": "no-store" }, status: 500 },
    );
  }

  return NextResponse.json(
    {
      configured: true,
      slots: data || [],
    },
    { headers: { "cache-control": "no-store" } },
  );
}
