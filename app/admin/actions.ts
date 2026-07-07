"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient, requireAdmin } from "@/lib/supabase/server";

function stringValue(formData: FormData, key: string, fallback = "") {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : fallback;
}

function numberValue(formData: FormData, key: string, fallback = 0) {
  const value = Number(stringValue(formData, key, String(fallback)));
  return Number.isFinite(value) ? value : fallback;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function revalidateSiteContent() {
  revalidatePath("/");
  revalidatePath("/api/site-content");
}

function revalidateGalleryContent() {
  revalidatePath("/");
  revalidatePath("/api/gallery");
}

export async function loginAdmin(formData: FormData) {
  const email = stringValue(formData, "email");
  const password = stringValue(formData, "password");
  const next = stringValue(formData, "next", "/admin");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    redirect("/admin/login?error=Supabase environment variables are not configured yet");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(next || "/admin");
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function changePassword(formData: FormData) {
  const { supabase } = await requireAdmin();
  const password = stringValue(formData, "password");

  if (password.length < 8) {
    redirect("/admin?tab=account&error=Password must be at least 8 characters");
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/admin?tab=account&error=${encodeURIComponent(error.message)}`);
  }

  redirect("/admin?tab=account&success=Password updated");
}

export async function updateSiteSettings(formData: FormData) {
  const { supabase } = await requireAdmin();

  await supabase.from("site_settings").upsert({
    key: "contact",
    value: {
      phone: stringValue(formData, "phone"),
      email: stringValue(formData, "email"),
      facebookUrl: stringValue(formData, "facebookUrl"),
      whatsappNumber: stringValue(formData, "whatsappNumber"),
      address: stringValue(formData, "address"),
      mapUrl: stringValue(formData, "mapUrl"),
      mapEmbedUrl: stringValue(formData, "mapEmbedUrl"),
    },
    updated_at: new Date().toISOString(),
  });

  revalidateSiteContent();
  redirect("/admin?tab=content&success=Contact updated");
}

export async function updateHomepageSection(formData: FormData) {
  const { supabase } = await requireAdmin();
  const sectionKey = stringValue(formData, "section_key");

  await supabase.from("homepage_sections").upsert({
    section_key: sectionKey,
    title: stringValue(formData, "title"),
    description: stringValue(formData, "description"),
    content: { body: stringValue(formData, "body") },
    sort_order: numberValue(formData, "sort_order"),
    updated_at: new Date().toISOString(),
  });

  revalidateSiteContent();
  redirect("/admin?tab=content&success=Section updated");
}

export async function updateDoctorProfile(formData: FormData) {
  const { supabase } = await requireAdmin();

  await supabase.from("doctor_profile").upsert({
    id: 1,
    name: stringValue(formData, "name"),
    designation: stringValue(formData, "designation"),
    introduction: stringValue(formData, "introduction"),
    bmdc_registration: stringValue(formData, "bmdc_registration"),
    photo_url: stringValue(formData, "photo_url", "/images/doctor-portrait.png"),
    updated_at: new Date().toISOString(),
  });

  revalidateSiteContent();
  redirect("/admin?tab=doctor&success=Doctor profile updated");
}

export async function upsertDoctorCredential(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = stringValue(formData, "id");
  const payload = {
    label: stringValue(formData, "label"),
    title: stringValue(formData, "title"),
    description: stringValue(formData, "description"),
    sort_order: numberValue(formData, "sort_order"),
    updated_at: new Date().toISOString(),
  };

  if (id) {
    await supabase.from("doctor_credentials").update(payload).eq("id", id);
  } else {
    await supabase.from("doctor_credentials").insert(payload);
  }

  revalidateSiteContent();
  redirect("/admin?tab=doctor&success=Credential saved");
}

export async function upsertDoctorExperience(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = stringValue(formData, "id");
  const payload = {
    role: stringValue(formData, "role"),
    organization: stringValue(formData, "organization"),
    sort_order: numberValue(formData, "sort_order"),
    updated_at: new Date().toISOString(),
  };

  if (id) {
    await supabase.from("doctor_experiences").update(payload).eq("id", id);
  } else {
    await supabase.from("doctor_experiences").insert(payload);
  }

  revalidateSiteContent();
  redirect("/admin?tab=doctor&success=Experience saved");
}

export async function deleteRow(formData: FormData) {
  const { supabase } = await requireAdmin();
  const table = stringValue(formData, "table");
  const id = stringValue(formData, "id");
  const tab = stringValue(formData, "tab", "dashboard");
  const allowed = new Set([
    "doctor_credentials",
    "doctor_experiences",
    "gallery_images",
    "services",
    "appointments",
    "blog_posts",
    "faqs",
    "media_assets",
  ]);

  if (!allowed.has(table) || !id) {
    redirect(`/admin?tab=${tab}&error=Invalid delete request`);
  }

  await supabase.from(table).delete().eq("id", id);
  if (table === "gallery_images") {
    revalidateGalleryContent();
  } else {
    revalidateSiteContent();
  }
  redirect(`/admin?tab=${tab}&success=Deleted`);
}

export async function upsertGalleryImage(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = stringValue(formData, "id");
  const payload = {
    src: stringValue(formData, "src"),
    alt: stringValue(formData, "alt"),
    caption: stringValue(formData, "caption"),
    category: stringValue(formData, "category", "Chamber"),
    width: numberValue(formData, "width", 1200),
    height: numberValue(formData, "height", 900),
    sort_order: numberValue(formData, "sort_order"),
  };

  if (id) {
    await supabase.from("gallery_images").update(payload).eq("id", id);
  } else {
    await supabase.from("gallery_images").insert(payload);
  }

  revalidateGalleryContent();
  redirect("/admin?tab=gallery&success=Gallery image saved");
}

export async function upsertService(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = stringValue(formData, "id");
  const title = stringValue(formData, "title");
  const payload = {
    title,
    slug: stringValue(formData, "slug", slugify(title)),
    description: stringValue(formData, "description"),
    icon: stringValue(formData, "icon", "Smile"),
    sort_order: numberValue(formData, "sort_order"),
    is_active: formData.get("is_active") === "on",
    updated_at: new Date().toISOString(),
  };

  if (id) {
    await supabase.from("services").update(payload).eq("id", id);
  } else {
    await supabase.from("services").insert(payload);
  }

  revalidateSiteContent();
  redirect("/admin?tab=services&success=Service saved");
}

export async function updateAppointmentStatus(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase
    .from("appointments")
    .update({ status: stringValue(formData, "status") })
    .eq("id", stringValue(formData, "id"));

  redirect("/admin?tab=appointments&success=Appointment updated");
}

export async function upsertBlogPost(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = stringValue(formData, "id");
  const title = stringValue(formData, "title");
  const status = stringValue(formData, "status", "Draft");
  const payload = {
    title,
    slug: stringValue(formData, "slug", slugify(title)),
    category: stringValue(formData, "category"),
    excerpt: stringValue(formData, "excerpt"),
    content: stringValue(formData, "content"),
    featured_image: stringValue(formData, "featured_image"),
    seo_title: stringValue(formData, "seo_title"),
    seo_description: stringValue(formData, "seo_description"),
    status,
    published_at: status === "Published" ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    await supabase.from("blog_posts").update(payload).eq("id", id);
  } else {
    await supabase.from("blog_posts").insert(payload);
  }

  revalidatePath("/blog");
  redirect("/admin?tab=blog&success=Blog post saved");
}

export async function upsertFaq(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = stringValue(formData, "id");
  const payload = {
    question: stringValue(formData, "question"),
    answer: stringValue(formData, "answer"),
    sort_order: numberValue(formData, "sort_order"),
    updated_at: new Date().toISOString(),
  };

  if (id) {
    await supabase.from("faqs").update(payload).eq("id", id);
  } else {
    await supabase.from("faqs").insert(payload);
  }

  revalidateSiteContent();
  redirect("/admin?tab=faq&success=FAQ saved");
}

export async function updateSeo(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("seo_settings").upsert({
    id: 1,
    homepage_meta_title: stringValue(formData, "homepage_meta_title"),
    homepage_meta_description: stringValue(formData, "homepage_meta_description"),
    open_graph_image: stringValue(formData, "open_graph_image", "/images/IMG_0905.JPG"),
    updated_at: new Date().toISOString(),
  });

  revalidateSiteContent();
  redirect("/admin?tab=seo&success=SEO updated");
}

export async function uploadMedia(formData: FormData) {
  const { supabase } = await requireAdmin();
  const file = formData.get("file");
  const alt = stringValue(formData, "alt");

  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin?tab=media&error=Choose an image file");
  }

  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const { error } = await supabase.storage.from("media").upload(filename, file, {
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) {
    redirect(`/admin?tab=media&error=${encodeURIComponent(error.message)}`);
  }

  const { data } = supabase.storage.from("media").getPublicUrl(filename);
  await supabase.from("media_assets").insert({
    url: data.publicUrl,
    filename,
    alt,
    bucket: "media",
  });

  redirect("/admin?tab=media&success=Media uploaded");
}
