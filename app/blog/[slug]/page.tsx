import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarCheck, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { blogPosts } from "@/lib/blog-posts";
import { getPublicBlogPost, getPublicBlogPosts } from "@/lib/cms-blog";

type BlogDetailProps = {
  params: Promise<{
    slug: string;
  }>;
};

const phoneNumber = "01727-529609";
const telHref = `tel:${phoneNumber}`;
const whatsappUrl =
  "https://wa.me/8801727529609?text=I%20want%20to%20book%20a%20dental%20consultation%20at%20Khidmah%20Dental%20Surgery";

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicBlogPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
      images: ["/images/IMG_0905.JPG"],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getPublicBlogPost(slug), getPublicBlogPosts()]);

  if (!post) {
    notFound();
  }

  const relatedPosts = posts
    .filter((item) => item.slug !== post.slug && item.category === post.category)
    .concat(posts.filter((item) => item.slug !== post.slug && item.category !== post.category))
    .slice(0, 3);
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: "Dr. Md. Iqbal Hossain",
    },
    publisher: {
      "@type": "Organization",
      name: "Khidmah Dental Surgery",
      logo: {
        "@type": "ImageObject",
        url: "https://khidmahdentalsurgery.com/logo.svg",
      },
    },
    mainEntityOfPage: `https://khidmahdentalsurgery.com/blog/${post.slug}`,
  };

  return (
    <main className="min-h-screen overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <section className="section-shell pt-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary"
        >
          <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
          Back to blog
        </Link>
      </section>

      <article>
        <header className="section-shell py-16">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-md bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                {post.category}
              </span>
              <span className="text-sm font-semibold text-muted-foreground">{post.readTime}</span>
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-normal text-foreground sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">{post.intro}</p>
          </div>
        </header>

        <section className="bg-white py-16">
          <div className="section-shell grid gap-10 lg:grid-cols-[0.72fr_1fr]">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-lg border border-border bg-background p-5">
                <div className="flex gap-3">
                  <CalendarCheck className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <p className="text-sm font-semibold leading-7 text-muted-foreground">
                    This article is for general awareness. Please book a consultation for diagnosis.
                  </p>
                </div>
                <div className="mt-5 grid gap-3">
                  <Button asChild>
                    <a href={whatsappUrl} target="_blank" rel="noreferrer">
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      WhatsApp
                    </a>
                  </Button>
                    <Button variant="outline" asChild>
                      <a href={telHref}>
                        <Phone className="h-4 w-4" aria-hidden="true" />
                        Call Chamber
                      </a>
                    </Button>
                </div>
              </div>
            </aside>

            <div className="grid gap-6">
              {post.sections.map((section) => (
                <section key={section.heading} className="rounded-lg border border-border bg-background p-6">
                  <h2 className="text-2xl font-bold tracking-normal">{section.heading}</h2>
                  <p className="mt-4 leading-8 text-muted-foreground">{section.body}</p>
                </section>
              ))}
            </div>
          </div>
        </section>
      </article>

      <section className="section-shell py-16">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Related Articles</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {relatedPosts.map((related) => (
            <Link
              key={related.slug}
              href={`/blog/${related.slug}`}
              className="rounded-lg border border-border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            >
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                {related.category}
              </span>
              <h3 className="mt-3 font-bold">{related.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{related.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
