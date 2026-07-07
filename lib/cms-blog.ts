import { createClient } from "@supabase/supabase-js";

import { blogPosts, type BlogCategory, type BlogPost } from "@/lib/blog-posts";

const blogColumns = [
  "title",
  "slug",
  "category",
  "excerpt",
  "content",
  "featured_image",
  "seo_title",
  "seo_description",
  "published_at",
  "updated_at",
].join(",");

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function splitContent(body: string) {
  const normalized = body.trim();

  if (!normalized) {
    return [];
  }

  const sections = normalized
    .split(/\n(?=#{2,3}\s+)/)
    .filter(Boolean)
    .map((section, index) => {
      const lines = section.split("\n");
      const firstLine = lines[0]?.trim() || "";
      const hasHeading = /^#{2,3}\s+/.test(firstLine);
      const heading = hasHeading ? firstLine.replace(/^#{2,3}\s+/, "").trim() : index === 0 ? "Overview" : "";
      const content = hasHeading ? lines.slice(1).join("\n").trim() : section.trim();

      return {
        heading: heading || "Overview",
        body: content,
      };
    })
    .filter((section) => section.body);

  return sections.length ? sections : [{ heading: "Overview", body: normalized }];
}

function mapPost(row: any): BlogPost {
  const body = String(row.content || "");
  const publishedAt = row.published_at || row.updated_at || new Date().toISOString();
  const title = String(row.title || "");
  const excerpt = String(row.excerpt || row.seo_description || "");

  return {
    slug: String(row.slug || ""),
    title,
    excerpt,
    category: row.category as BlogCategory,
    featuredImage: row.featured_image || "/images/IMG_0905.JPG",
    publishedAt,
    readTime: `${Math.max(2, Math.ceil(body.split(/\s+/).filter(Boolean).length / 180))} min read`,
    metaTitle: row.seo_title || `${title} | Khidmah Dental Surgery`,
    metaDescription: row.seo_description || excerpt,
    intro: excerpt,
    content: body,
    sections: splitContent(body),
  };
}

function fallbackPosts(limit?: number) {
  const posts = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return typeof limit === "number" ? posts.slice(0, limit) : posts;
}

export async function getPublicBlogPosts(options: { limit?: number } = {}) {
  const supabase = getSupabase();

  if (!supabase) {
    return fallbackPosts(options.limit);
  }

  let query = supabase
    .from("blog_posts")
    .select(blogColumns)
    .eq("status", "Published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (typeof options.limit === "number") {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    return [];
  }

  return (data || []).map(mapPost);
}

export async function getPublicBlogPost(slug: string) {
  const supabase = getSupabase();

  if (!supabase) {
    return fallbackPosts().find((post) => post.slug === slug);
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select(blogColumns)
    .eq("status", "Published")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return undefined;
  }

  return mapPost(data);
}

export async function getRelatedBlogPosts(post: BlogPost, limit = 3) {
  const supabase = getSupabase();

  if (!supabase) {
    return fallbackPosts()
      .filter((item) => item.slug !== post.slug)
      .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
      .slice(0, limit);
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select(blogColumns)
    .eq("status", "Published")
    .neq("slug", post.slug)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(12);

  if (error) {
    return [];
  }

  return (data || [])
    .map(mapPost)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, limit);
}
