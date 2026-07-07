import { NextResponse } from "next/server";

import { getPublicBlogPosts } from "@/lib/cms-blog";

export const revalidate = 300;

export async function GET() {
  const posts = await getPublicBlogPosts({ limit: 3 });

  return NextResponse.json({
    posts: posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      featuredImage: post.featuredImage,
      publishedAt: post.publishedAt,
    })),
  });
}
