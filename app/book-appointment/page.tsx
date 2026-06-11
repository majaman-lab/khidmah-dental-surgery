import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { BookAppointmentForm } from "@/components/book-appointment-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Book Appointment | Khidmah Dental Surgery",
  description:
    "Book an appointment with Dr. Md. Iqbal Hossain at Khidmah Dental Surgery, Beanibazar. Request root canal, scaling, cosmetic filling, crown and bridge, braces consultation and more.",
  alternates: {
    canonical: "/book-appointment",
  },
  openGraph: {
    title: "Book Appointment | Khidmah Dental Surgery",
    description:
      "Request a dental appointment with Dr. Md. Iqbal Hossain at Khidmah Dental Surgery, Beanibazar.",
    url: "/book-appointment",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Appointment | Khidmah Dental Surgery",
    description:
      "Request a dental appointment with Dr. Md. Iqbal Hossain at Khidmah Dental Surgery, Beanibazar.",
    images: ["/images/khidmah-dental-chamber.jpg"],
  },
};

const phoneNumber = "01727-529609";
const telHref = `tel:${phoneNumber}`;
const whatsappUrl = "https://wa.me/8801727529609";

export default function BookAppointmentPage() {
  return (
    <main id="main-content" className="min-h-screen overflow-hidden">
      <section className="section-shell pt-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary">
          <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
          Back to homepage
        </Link>
      </section>

      <section className="section-shell grid gap-8 py-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <aside className="grid gap-5 lg:sticky lg:top-28">
          <div className="rounded-lg border border-border bg-white/86 p-6 shadow-soft">
            <span className="flex h-14 w-14 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <UserRound className="h-7 w-7" aria-hidden="true" />
            </span>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-primary">Doctor Trust Card</p>
            <h2 className="mt-3 text-2xl font-bold tracking-normal">Dr. Md. Iqbal Hossain</h2>
            <p className="mt-2 font-semibold text-primary">Owner & Chief Consultant</p>
            <p className="mt-4 leading-7 text-muted-foreground">
              Personal appointment-based care at Khidmah Dental Surgery, Beanibazar.
            </p>
          </div>

          <div className="grid gap-3">
            <TrustLine icon={ShieldCheck} text="Single-doctor consultation" />
            <TrustLine icon={BadgeCheck} text="Clear treatment explanation" />
            <TrustLine icon={Clock3} text="Appointment-focused schedule" />
            <TrustLine icon={MapPin} text="Nimtola, Beanibazar, Sylhet" />
          </div>

          <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
            <p className="font-bold">Need help booking?</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Button variant="outline" asChild>
                <a href={telHref}>
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call Chamber
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={whatsappUrl} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </aside>

        <BookAppointmentForm />
      </section>
    </main>
  );
}

function TrustLine({
  icon: Icon,
  text,
}: {
  icon: LucideIcon;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-border bg-white/82 p-4 shadow-sm">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <p className="text-sm font-semibold leading-6">{text}</p>
    </div>
  );
}
