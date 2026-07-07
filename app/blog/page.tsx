import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarCheck } from "lucide-react";

import { BlogListing } from "@/components/blog-listing";
import { getPublicBlogPosts } from "@/lib/cms-blog";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Dental Blog | Khidmah Dental Surgery",
  description:
    "Dental tips and treatment guides from Khidmah Dental Surgery in Beanibazar, Sylhet. Learn about root canal, scaling, cosmetic dentistry, braces and oral care.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Dental Blog | Khidmah Dental Surgery",
    description:
      "Dental tips and treatment guides from Khidmah Dental Surgery in Beanibazar, Sylhet.",
    url: "/blog",
    type: "website",
    images: ["/images/IMG_0905.JPG"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dental Blog | Khidmah Dental Surgery",
    description:
      "Dental tips and treatment guides from Khidmah Dental Surgery in Beanibazar, Sylhet.",
    images: ["/images/IMG_0905.JPG"],
  },
};

export default async function BlogPage() {
  const posts = await getPublicBlogPosts();
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Dental Blog | Khidmah Dental Surgery",
    description:
      "Dental tips and treatment guides from Khidmah Dental Surgery in Beanibazar, Sylhet.",
    url: "https://khidmahdentalsurgery.com/blog",
  };

  return (
    <main id="main-content" className="min-h-screen overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <section className="section-shell pt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary"
        >
          <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
          Back to Khidmah Dental Surgery
        </Link>
      </section>

      <section className="section-shell py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-md border border-primary/18 bg-white/72 px-3 py-2 text-sm font-semibold text-primary shadow-sm">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Dental Blog
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.08] tracking-normal text-foreground sm:text-5xl">
              Dental care guides from Khidmah Dental Surgery
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              Read practical oral health articles from a personal dental chamber in Beanibazar, Sylhet.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
            <div className="flex gap-3">
              <CalendarCheck className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <p className="text-sm font-semibold leading-7 text-muted-foreground">
                Articles are for awareness only. A dental consultation is required for diagnosis and treatment planning.
              </p>
            </div>
          </div>
        </div>
      </section>

      <BlogListing posts={posts} />
    </main>
  );
}
