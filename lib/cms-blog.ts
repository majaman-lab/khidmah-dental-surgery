import { createClient } from "@supabase/supabase-js";

import { blogPosts, type BlogCategory, type BlogPost } from "@/lib/blog-posts";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey);
}

function mapPost(row: any): BlogPost {
  const body = String(row.content || "");
  const sections = body
    .split(/\n#{2,3}\s+/)
    .filter(Boolean)
    .map((section, index) => {
      const [firstLine, ...rest] = section.split("\n");
      return {
        heading: index === 0 && !body.trim().startsWith("#") ? "Overview" : firstLine.trim(),
        body: (index === 0 && !body.trim().startsWith("#") ? section : rest.join("\n")).trim(),
      };
    })
    .filter((section) => section.body);

  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || row.seo_description || "",
    category: row.category as BlogCategory,
    publishedAt: row.published_at || row.updated_at,
    readTime: `${Math.max(2, Math.ceil(body.split(/\s+/).length / 180))} min read`,
    metaTitle: row.seo_title || `${row.title} | Khidmah Dental Surgery`,
    metaDescription: row.seo_description || row.excerpt || "",
    intro: row.excerpt || row.seo_description || "",
    sections: sections.length ? sections : [{ heading: "Overview", body }],
  };
}

export async function getPublicBlogPosts() {
  const supabase = getSupabase();

  if (!supabase) {
    return blogPosts;
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "Published")
    .order("published_at", { ascending: false });

  if (error || !data?.length) {
    return blogPosts;
  }

  return data.map(mapPost);
}

export async function getPublicBlogPost(slug: string) {
  const posts = await getPublicBlogPosts();
  return posts.find((post) => post.slug === slug);
}
