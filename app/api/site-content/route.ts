import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.json({ configured: false }, { headers: { "cache-control": "no-store" } });
  }

  const supabase = createClient(url, anonKey);
  const [sections, contact, doctor, credentials, experiences, services, faqs, seo] =
    await Promise.all([
      supabase.from("homepage_sections").select("*").order("sort_order", { ascending: true }),
      supabase.from("site_settings").select("*").eq("key", "contact").maybeSingle(),
      supabase.from("doctor_profile").select("*").eq("id", 1).maybeSingle(),
      supabase.from("doctor_credentials").select("*").order("sort_order", { ascending: true }),
      supabase.from("doctor_experiences").select("*").order("sort_order", { ascending: true }),
      supabase.from("services").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
      supabase.from("faqs").select("*").order("sort_order", { ascending: true }),
      supabase.from("seo_settings").select("*").eq("id", 1).maybeSingle(),
    ]);

  return NextResponse.json({
    configured: true,
    sections: sections.data || [],
    contact: contact.data?.value || null,
    doctor: doctor.data || null,
    credentials: credentials.data || [],
    experiences: experiences.data || [],
    services: services.data || [],
    faqs: faqs.data || [],
    seo: seo.data || null,
  }, { headers: { "cache-control": "no-store" } });
}
