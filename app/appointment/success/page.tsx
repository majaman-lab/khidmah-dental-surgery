import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Home, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Appointment Request Received | Khidmah Dental Surgery",
  description:
    "Your appointment request has been received by Khidmah Dental Surgery and is pending confirmation.",
  robots: {
    index: false,
    follow: false,
  },
};

type AppointmentSuccessSearchParams = {
  name?: string;
  doctor?: string;
  service?: string;
  date?: string;
  time?: string;
  ref?: string;
  whatsapp?: string;
};

const phoneNumber = "01727-529609";
const telHref = `tel:${phoneNumber}`;
const defaultWhatsappUrl =
  "https://wa.me/8801727529609?text=I%20have%20submitted%20an%20appointment%20request%20at%20Khidmah%20Dental%20Surgery.";

export default async function AppointmentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<AppointmentSuccessSearchParams>;
}) {
  const params = await searchParams;
  const patientName = params.name || "Patient";
  const doctor = params.doctor || "Dr. Md. Iqbal Hossain";
  const service = params.service || "Dental Consultation";
  const appointmentDate = params.date || "Selected date";
  const appointmentTime = params.time || "Selected time";
  const referenceNumber = params.ref || "Pending";
  const whatsappUrl = params.whatsapp || defaultWhatsappUrl;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://khidmahdentalsurgery.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Appointment Confirmation",
        item: "https://khidmahdentalsurgery.com/appointment/success",
      },
    ],
  };

  return (
    <main id="main-content" className="min-h-screen overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="section-shell grid min-h-screen place-items-center py-12">
        <div className="w-full max-w-3xl rounded-lg border border-white bg-white p-5 shadow-soft sm:p-8">
          <div className="text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
            </span>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Appointment Status
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
              {"\u2714 Appointment Request Received"}
            </h1>
            <p className="mt-4 leading-7 text-muted-foreground">
              Thank you. Your appointment request has been received and is awaiting chamber confirmation.
            </p>
          </div>

          <div className="mt-8 rounded-lg border border-border bg-background p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <Detail label="Patient Name" value={patientName} />
              <Detail label="Doctor" value={doctor} />
              <Detail label="Service" value={service} />
              <Detail label="Appointment Date" value={appointmentDate} />
              <Detail label="Appointment Time" value={formatSlotTime(appointmentTime)} />
              <Detail label="Reference Number" value={referenceNumber} highlight />
            </div>
            <div className="mt-4 rounded-md border border-primary/20 bg-accent px-4 py-3 text-sm font-bold text-primary">
              Status: Pending Confirmation
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Button variant="outline" asChild>
              <a href={telHref}>
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call Clinic
              </a>
            </Button>
            <Button asChild>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="h-4 w-4" aria-hidden="true" />
                Back Home
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function Detail({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-md border border-border bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className={`mt-2 text-base font-bold ${highlight ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}

function formatSlotTime(value: string) {
  if (!value.includes(":")) {
    return value;
  }

  const [hourValue, minuteValue] = value.split(":");
  const hour = Number(hourValue);
  const minute = Number(minuteValue);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(2000, 0, 1, hour, minute));
}
