"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Facebook,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GallerySection = dynamic(() =>
  import("@/components/gallery-section").then((mod) => mod.GallerySection),
);

const navItems = [
  ["Services", "#services"],
  ["Doctor", "#doctor"],
  ["Why Choose", "#why-choose"],
  ["Gallery", "#gallery"],
  ["FAQ", "#faq"],
  ["Contact", "#contact"],
];

const phoneNumber = "01727-529609";
const whatsappUrl =
  "https://wa.me/8801727529609?text=I%20want%20to%20book%20an%20appointment%20at%20Khidmah%20Dental%20Surgery";
const facebookUrl = "https://www.facebook.com/khidmahdental";
const mapUrl = "https://maps.app.goo.gl/tCgshywFHaJxF4eE6";
const email = "drmdiqbalhussain@gmail.com";
const address = "Nimar Ali Mansion (2nd Floor), Nimtola, Beanibazar, Sylhet 3170";
const telHref = `tel:${phoneNumber}`;

const services = [
  {
    title: "Root Canal Treatment",
    slug: "root-canal-treatment",
    text: "Pain-focused care to treat infected teeth and preserve natural tooth structure whenever possible.",
    icon: ShieldCheck,
  },
  {
    title: "Scaling & Polishing",
    slug: "scaling-polishing",
    text: "Gentle cleaning for gum health, stain removal, and a fresher confident smile.",
    icon: Sparkles,
  },
  {
    title: "Cosmetic Filling",
    slug: "cosmetic-filling",
    text: "Tooth-colored restorations for decay, chips, sensitivity, and visible smile-area repair.",
    icon: Smile,
  },
  {
    title: "Crown & Bridge",
    slug: "crown-bridge",
    text: "Restorative guidance for damaged or missing teeth with practical function and appearance in mind.",
    icon: BadgeCheck,
  },
  {
    title: "Braces Consultation",
    slug: "braces-consultation",
    text: "Clear orthodontic assessment and guidance for alignment, bite concerns, and smile planning.",
    icon: Stethoscope,
  },
  {
    title: "Smile Enhancement",
    slug: "smile-enhancement",
    text: "Personalized improvement plans focused on confidence, facial harmony, and healthy aesthetics.",
    icon: CheckCircle2,
  },
];

const timeline = [
  {
    label: "Degree",
    title: "BDS (DU)",
    text: "Bachelor of Dental Surgery, University of Dhaka",
    icon: GraduationCap,
  },
  {
    label: "Advanced Training",
    title: "PGT Oral & Maxillofacial Surgery",
    text: "Post-graduate training focused on oral and maxillofacial surgical care",
    icon: Award,
  },
  {
    label: "Hospital Experience",
    title: "Dhaka Medical College Hospital",
    text: "Former Honorary Medical Officer (HMO)",
    icon: ShieldCheck,
  },
  {
    label: "Institution",
    title: "TMSS",
    text: "Professional training and clinical exposure",
    icon: BadgeCheck,
  },
  {
    label: "Registration",
    title: "BMDC Registration",
    text: "Registered dental practitioner under Bangladesh Medical & Dental Council",
    icon: CheckCircle2,
  },
];

const whyChoose = [
  "Personalized Consultation",
  "Modern Dental Equipment",
  "Comfortable Chamber Environment",
  "Clear Treatment Explanation",
  "Appointment-Based Care",
  "Convenient Beanibazar Location",
];

const faqs = [
  {
    q: "Is Khidmah Dental Surgery a hospital?",
    a: "No. It is a personal dental chamber led by Dr. Md. Iqbal Hossain.",
  },
  {
    q: "Do I need an appointment?",
    a: "Appointments are recommended for faster service and better consultation time.",
  },
  {
    q: "What treatments are available?",
    a: "Root canal treatment, scaling, cosmetic filling, crown and bridge, braces consultation and smile enhancement.",
  },
  {
    q: "Where is the chamber located?",
    a: "Nimar Ali Mansion (2nd Floor), Nimtola, Beanibazar, Sylhet.",
  },
];

const smoothEase = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.62, ease: smoothEase },
};

const heroReveal = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: smoothEase },
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main id="main-content" className="min-h-screen overflow-hidden">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/60 bg-white/84 backdrop-blur-xl">
        <nav className="section-shell flex h-20 items-center justify-between gap-6 lg:grid lg:grid-cols-[auto_1fr_auto]">
          <a href="#home" className="flex items-center gap-3" aria-label="Khidmah Dental Surgery home">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
              <Image
                  src="/logo.svg"
                  alt=""
                  width={28}
                  height={28}
                className="h-7 w-7"
                priority
              />
            </span>
            <span>
              <span className="block text-base font-bold leading-tight tracking-normal">Khidmah Dental</span>
              <span className="block text-xs font-medium text-muted-foreground">Surgery, Beanibazar</span>
            </span>
          </a>

          <div className="hidden items-center justify-center gap-7 lg:flex">
            {navItems.map(([label, href]) => (
              <a key={href} href={href} className="text-sm font-semibold text-muted-foreground transition hover:text-primary">
                {label}
              </a>
            ))}
          </div>

          <div className="hidden items-center justify-end lg:flex">
            <Button asChild>
              <Link href="/book-appointment">Book Appointment</Link>
            </Button>
          </div>

          <Button
            className="lg:hidden"
            variant="ghost"
            size="icon"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </nav>
        {menuOpen ? (
          <div className="border-t border-border bg-white lg:hidden">
            <div className="section-shell grid gap-1 py-4">
              {navItems.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="rounded-md px-3 py-3 text-sm font-semibold hover:bg-muted"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              ))}
              <Button asChild className="mt-3">
                <Link href="/book-appointment" onClick={() => setMenuOpen(false)}>
                  Book Appointment
                </Link>
              </Button>
            </div>
          </div>
        ) : null}
      </header>

      <section id="home" className="section-shell pt-28 sm:pt-32 lg:pt-36">
        <div className="grid min-h-[calc(100vh-7rem)] items-center gap-14 pb-20 sm:pb-24 lg:grid-cols-[1.06fr_0.94fr] lg:gap-16">
          <motion.div {...heroReveal}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-primary/18 bg-white/72 px-3 py-2 text-sm font-semibold text-primary shadow-sm">
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              Owner & Chief Consultant, Beanibazar
            </div>
            <h1 className="max-w-3xl text-[2.7rem] font-bold leading-[1.06] tracking-normal text-foreground sm:text-5xl lg:text-6xl">
              Khidmah Dental Surgery
            </h1>
            <p className="mt-5 max-w-2xl text-xl font-semibold leading-8 text-primary sm:text-2xl sm:leading-9">
              Professional dental care in Beanibazar by Dr. Md. Iqbal Hossain.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              A quiet single-doctor dental chamber for calm consultations, clear treatment explanation, and appointment-based care in Sylhet.
            </p>
            <div className="mt-9">
              <Button size="lg" className="h-14 bg-[#1f8f5f] px-7 text-base shadow-sm hover:bg-[#18764f]" asChild>
                <Link href="/book-appointment">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  Book Appointment
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {["Single-doctor care", "Clear explanation", "Beanibazar location"].map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.18, ease: smoothEase }}
                  className="flex min-h-16 items-center gap-3 rounded-lg border border-white bg-white/76 p-4 shadow-sm"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span className="text-sm font-semibold">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div {...heroReveal} transition={{ duration: 0.75, ease: smoothEase, delay: 0.12 }}>
            <div className="relative lg:pl-4">
              <div className="absolute -inset-5 rounded-[2rem] bg-accent/35 blur-2xl" />
              <div className="relative overflow-hidden rounded-lg border border-white bg-white shadow-soft">
                <Image
                  src="/images/IMG_0905.JPG"
                  alt="Treatment room at Khidmah Dental Surgery"
                  width={4032}
                  height={3024}
                  priority
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="aspect-[4/3] h-full w-full object-cover"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: smoothEase }}
                className="relative mx-4 -mt-16 rounded-lg border border-border bg-white/94 p-5 shadow-soft backdrop-blur sm:mx-8 lg:absolute lg:-bottom-8 lg:left-0 lg:mx-0 lg:w-[88%]"
              >
                <div className="flex items-start gap-4">
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-accent">
                    <Image
                      src="/images/doctor-portrait.png"
                      alt="Dr. Md. Iqbal Hossain"
                      width={1304}
                      height={1694}
                      sizes="64px"
                      className="h-full w-full object-cover object-top"
                    />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      Meet Your Dentist
                    </p>
                    <h2 className="mt-1 text-xl font-bold">Dr. Md. Iqbal Hossain</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Owner & Chief Consultant, Khidmah Dental Surgery, Beanibazar.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <SectionHeader
        id="services"
        eyebrow="Services"
        title="Focused dental care for confident smiles"
        text="Essential dental treatments delivered through a personal chamber model with careful consultation and clear next steps."
      />
      <section className="section-shell content-section grid gap-5 pb-28 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <motion.div key={service.title} {...fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.55, delay: index * 0.04 }}>
            <Card className="h-full bg-white/86">
              <CardHeader>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-accent text-primary">
                  <service.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-7 text-muted-foreground">{service.text}</p>
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary"
                >
                  Learn more
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      <section id="doctor" className="content-section bg-white py-24 sm:py-32">
        <div className="section-shell grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.div {...fadeUp}>
            <div className="mb-8 overflow-hidden rounded-lg border border-border bg-background shadow-soft">
              <Image
                src="/images/doctor-portrait.png"
                alt="Portrait of Dr. Md. Iqbal Hossain"
                width={1304}
                height={1694}
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">About Doctor</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">Dr. Md. Iqbal Hossain</h2>
            <p className="mt-3 text-lg font-semibold text-primary">
              Owner & Chief Consultant, Khidmah Dental Surgery, Beanibazar
            </p>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Khidmah Dental Surgery is intentionally positioned as a personal chamber, not a hospital or multi-doctor clinic. Patients meet the doctor, understand their dental condition, and receive a practical treatment path shaped around trust and comfort.
            </p>
            <div className="mt-10 grid gap-3">
              <InfoRow icon={Clock3} text="Appointment-first care flow" />
              <InfoRow icon={ShieldCheck} text="Owner-led dental consultation" />
              <InfoRow icon={MessageCircle} text="Clear explanation before treatment" />
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="rounded-lg border border-border bg-background/70 p-4 shadow-soft sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Qualifications</p>
                <h3 className="mt-2 text-xl font-bold tracking-normal sm:text-2xl">Clinical credentials & registration</h3>
              </div>
              <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground sm:flex">
                <Award className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
            <div className="grid gap-3">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.45, delay: index * 0.035 }}
                  className="grid grid-cols-[2.5rem_1fr] items-start gap-3 rounded-lg border border-border bg-white p-3 shadow-sm sm:grid-cols-[2.75rem_1fr] sm:p-4"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-primary">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary">{item.label}</p>
                    <h3 className="mt-1 text-base font-bold leading-6">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <SectionHeader
        id="why-choose"
        eyebrow="Why Choose"
        title="Why patients choose Khidmah Dental"
        text="A personal dental chamber experience shaped around trust, comfort, and practical appointment conversion."
      />
      <section className="section-shell content-section grid gap-5 pb-28 md:grid-cols-2 lg:grid-cols-3">
        {whyChoose.map((item, index) => (
          <motion.div
            key={item}
            {...fadeUp}
            transition={{ duration: 0.55, delay: index * 0.04 }}
            className="flex items-start gap-4 rounded-lg border border-border bg-white/86 p-5 shadow-sm"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-bold">{item}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Designed for attentive, single-doctor dental care in Beanibazar.
              </p>
            </div>
          </motion.div>
        ))}
      </section>

      <GallerySection />

      <section id="faq" className="content-section bg-white py-24 sm:py-32">
        <div className="section-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div {...fadeUp}>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">Before your appointment</h2>
            <p className="mt-5 leading-8 text-muted-foreground">
              Quick answers that set the right expectation for a personal dental chamber.
            </p>
          </motion.div>
          <motion.div {...fadeUp} className="rounded-lg border border-border bg-background/80 p-3 shadow-soft sm:p-4">
            <Accordion type="single" collapsible defaultValue="item-0">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.q}
                  value={`item-${index}`}
                  className="mb-3 rounded-lg border border-border bg-white px-4 last:mb-0"
                >
                  <AccordionTrigger className="text-base sm:text-lg">
                    <span className="mr-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent text-sm font-bold text-primary">
                      {index + 1}
                    </span>
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="pl-11 text-base">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      <section id="contact" className="section-shell content-section py-24 sm:py-32">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div {...fadeUp} className="rounded-lg border border-border bg-white p-6 shadow-soft sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Contact</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal">Book a chamber visit</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              For the best experience, request an appointment before visiting Khidmah Dental Surgery.
            </p>
            <div className="mt-8 grid gap-4">
              <ContactLine
                icon={MapPin}
                label="Location"
                value={
                  <>
                    Khidmah Dental Surgery
                    <br />
                    {address}
                  </>
                }
              />
              <ContactLine icon={Clock3} label="Chamber Hours" value="Appointment-based schedule" />
              <ContactLine
                icon={Phone}
                label="Phone"
                value={<a href={telHref} className="font-semibold text-primary hover:underline">{phoneNumber}</a>}
              />
              <ContactLine
                icon={Mail}
                label="Email"
                value={<a href={`mailto:${email}`} className="font-semibold text-primary hover:underline">{email}</a>}
              />
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="outline" asChild>
                <a href={facebookUrl} target="_blank" rel="noreferrer">
                  <Facebook className="h-4 w-4" aria-hidden="true" />
                  Facebook
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={mapUrl} target="_blank" rel="noreferrer">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Map
                </a>
              </Button>
            </div>
          </motion.div>
          <motion.div {...fadeUp} className="grid gap-5">
            <div className="map-frame overflow-hidden rounded-lg border border-border bg-white shadow-soft [&_iframe]:min-h-[420px] sm:[&_iframe]:min-h-[460px]">
              <iframe
                title="Khidmah Dental Surgery map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=Khidmah%20Dental%20Surgery%20Nimar%20Ali%20Mansion%202nd%20Floor%20Nimtola%20Beanibazar%20Sylhet%203170&z=18&output=embed"
              />
            </div>
            <div className="overflow-hidden rounded-lg border border-border bg-white shadow-soft">
              <Image
                src="/images/IMG_3955.JPG"
                alt="Exterior building location of Khidmah Dental Surgery"
                width={4032}
                height={3024}
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="aspect-[16/9] w-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-border bg-foreground py-10 text-white">
        <div className="section-shell flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold">Khidmah Dental Surgery</p>
            <p className="mt-1 text-sm text-white/70">Personal dental chamber of Dr. Md. Iqbal Hossain.</p>
          </div>
          <a href="#home" className="text-sm font-semibold text-white/80 hover:text-white">
            Back to top
          </a>
        </div>
      </footer>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#1f8f5f] text-white shadow-soft ring-8 ring-[#1f8f5f]/14 transition hover:scale-105 sm:h-14 sm:w-auto sm:rounded-md sm:px-5"
        aria-label="Book appointment on WhatsApp"
      >
        <MessageCircle className="h-7 w-7" aria-hidden="true" />
        <span className="ml-2 hidden text-sm font-bold sm:inline">Book on WhatsApp</span>
      </a>
    </main>
  );
}

function SectionHeader({
  id,
  eyebrow,
  title,
  text,
}: {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <section id={id} className="section-shell scroll-mt-28 pb-12 pt-28">
      <motion.div {...fadeUp} className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">{title}</h2>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">{text}</p>
      </motion.div>
    </section>
  );
}

function InfoRow({
  icon: Icon,
  text,
}: {
  icon: LucideIcon;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-4">
      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
      <span className="font-semibold">{text}</span>
    </div>
  );
}

function ContactLine({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 rounded-lg border border-border bg-background p-4">
      <Icon className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <div>
        <p className="text-sm font-bold">{label}</p>
        <p className="mt-1 leading-6 text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}
