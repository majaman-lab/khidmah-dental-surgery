import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  MessageCircle,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServicePage, servicePages } from "@/lib/service-pages";

type ServicePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const phoneNumber = "01727-529609";
const telHref = `tel:${phoneNumber}`;
const whatsappBase =
  "https://wa.me/8801727529609?text=I%20want%20to%20book%20an%20appointment%20at%20Khidmah%20Dental%20Surgery";

export function generateStaticParams() {
  return servicePages.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServicePage(slug);

  if (!service) {
    return {};
  }

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `/services/${service.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: service.metaTitle,
      description: service.metaDescription,
      images: ["/images/khidmah-dental-chamber.jpg"],
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServicePage(slug);

  if (!service) {
    notFound();
  }

  const relatedServices = servicePages
    .filter((item) => item.slug !== service.slug)
    .slice(0, 3);
  const whatsappUrl = `${whatsappBase}%20for%20${encodeURIComponent(service.shortTitle)}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: service.title,
    description: service.metaDescription,
    url: `https://khidmahdentalsurgery.com/services/${service.slug}`,
    about: {
      "@type": "MedicalProcedure",
      name: service.shortTitle,
    },
    provider: {
      "@type": "Dentist",
      name: "Khidmah Dental Surgery",
      telephone: phoneNumber,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Nimar Ali Mansion (2nd Floor), Nimtola",
        addressLocality: "Beanibazar",
        addressRegion: "Sylhet",
        postalCode: "3170",
        addressCountry: "BD",
      },
    },
  };

  return (
    <main className="min-h-screen overflow-hidden">
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

      <section className="section-shell grid gap-10 py-16 lg:grid-cols-[1fr_0.72fr] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-md border border-primary/18 bg-white/72 px-3 py-2 text-sm font-semibold text-primary shadow-sm">
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            Personal dental chamber in Beanibazar
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.08] tracking-normal text-foreground sm:text-5xl">
            {service.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            {service.overview}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="bg-[#1f8f5f] hover:bg-[#18764f]" asChild>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Book on WhatsApp
              </a>
            </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={telHref}>
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call Chamber
                </a>
              </Button>
          </div>
        </div>

        <Card className="bg-white/88 shadow-soft">
          <CardHeader>
            <CardTitle>Khidmah Dental Surgery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {[
                "Dr. Md. Iqbal Hossain",
                "Owner & Chief Consultant",
                "Nimtola, Beanibazar, Sylhet 3170",
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-md bg-background p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <p className="text-sm font-semibold leading-6">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="bg-white py-16">
        <div className="section-shell grid gap-8 lg:grid-cols-2">
          <ContentBlock title="Treatment Overview" body={service.overview} />
          <ListBlock title="Benefits" items={service.benefits} />
        </div>
      </section>

      <section className="section-shell py-16">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Procedure</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal">What to expect</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Your visit is planned around personal consultation, clear explanation, and practical next steps.
            </p>
          </div>
          <div className="grid gap-4">
            {service.steps.map((step, index) => (
              <div
                key={step}
                className="grid grid-cols-[3rem_1fr] gap-4 rounded-lg border border-border bg-white p-5 shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <p className="self-center font-semibold leading-7">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.72fr_1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal">Questions about {service.shortTitle}</h2>
          </div>
          <div className="grid gap-4">
            {service.faqs.map((faq) => (
              <div key={faq.question} className="rounded-lg border border-border bg-background p-5">
                <h3 className="font-bold">{faq.question}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-16">
        <div className="rounded-lg border border-border bg-foreground p-6 text-white shadow-soft sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/70">Book Appointment</p>
              <h2 className="mt-3 text-3xl font-bold tracking-normal">Need {service.shortTitle}?</h2>
              <p className="mt-4 max-w-2xl leading-8 text-white/76">
                Request an appointment with Dr. Md. Iqbal Hossain at Khidmah Dental Surgery, Beanibazar.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <a href={whatsappUrl} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                </a>
              </Button>
              <Button variant="secondary" asChild>
                <a href={telHref}>
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call Now
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pb-20">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Related Services</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {relatedServices.map((related) => (
            <Link
              key={related.slug}
              href={`/services/${related.slug}`}
              className="rounded-lg border border-border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            >
              <h3 className="font-bold">{related.shortTitle}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Learn more about {related.shortTitle.toLowerCase()} at Khidmah Dental Surgery.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
                View service
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function ContentBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-6">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">{title}</p>
      <p className="mt-4 leading-8 text-muted-foreground">{body}</p>
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-border bg-background p-6">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">{title}</p>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div key={item} className="flex gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <p className="font-semibold leading-6">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
