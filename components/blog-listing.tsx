"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { blogCategories, type BlogCategory, type BlogPost } from "@/lib/blog-posts";
import { cn } from "@/lib/utils";

const allCategory = "All";
type ActiveCategory = typeof allCategory | BlogCategory;
const categoryOptions: ActiveCategory[] = [allCategory, ...blogCategories];

export function BlogListing({ posts }: { posts: BlogPost[] }) {
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>(allCategory);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return posts.filter((post) => {
      const categoryMatch = activeCategory === allCategory || post.category === activeCategory;
      const searchMatch =
        normalizedSearch.length === 0 ||
        [post.title, post.excerpt, post.category].join(" ").toLowerCase().includes(normalizedSearch);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, posts, searchTerm]);

  return (
    <section className="section-shell pb-20">
      <div className="rounded-lg border border-border bg-white p-4 shadow-soft sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search dental articles"
              className="h-12 w-full rounded-md border border-border bg-background pl-12 pr-4 text-sm font-medium outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/18"
              placeholder="Search dental articles"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "h-10 rounded-md border px-4 text-sm font-bold transition",
                  activeCategory === category
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-white text-muted-foreground hover:text-primary",
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.div layout className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post, index) => (
          <motion.article
            key={post.slug}
            layout
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-72 flex-col justify-between rounded-lg border border-border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
          >
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-md bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  {post.category}
                </span>
                <span className="text-sm font-semibold text-muted-foreground">{post.readTime}</span>
              </div>
              <h2 className="mt-5 text-xl font-bold leading-tight">{post.title}</h2>
              <p className="mt-4 leading-7 text-muted-foreground">{post.excerpt}</p>
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary"
            >
              Read article
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.article>
        ))}
      </motion.div>

      {filteredPosts.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-primary/30 bg-white p-8 text-center">
          <h2 className="text-xl font-bold">No articles found</h2>
          <p className="mt-3 text-muted-foreground">Try another search term or category.</p>
        </div>
      ) : null}
    </section>
  );
}
