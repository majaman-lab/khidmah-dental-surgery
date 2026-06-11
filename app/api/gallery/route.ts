import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { galleryItems } from "@/lib/gallery-items";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.json({ items: galleryItems });
  }

  const supabase = createClient(url, anonKey);
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return NextResponse.json({ items: galleryItems });
  }

  return NextResponse.json({
    items: data.map((item) => ({
      src: item.src,
      alt: item.alt,
      title: item.caption,
      category: item.category,
      width: item.width || 1200,
      height: item.height || 900,
    })),
  });
}
