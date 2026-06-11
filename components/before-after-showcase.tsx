"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const phoneNumber = "01727-529609";
const telHref = `tel:${phoneNumber}`;
const whatsappUrl =
  "https://wa.me/8801727529609?text=I%20want%20to%20book%20a%20treatment%20consultation%20at%20Khidmah%20Dental%20Surgery";

export function BeforeAfterShowcase() {
  const [sliderValue, setSliderValue] = useState(52);

  return (
    <section className="section-shell content-section py-20">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center"
      >
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Before & After
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
            Treatment showcase
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
            Use the slider to compare a placeholder case view. Real clinical photos can be
            added after patient consent and doctor approval.
          </p>

          <div className="mt-8 overflow-hidden rounded-lg border border-border bg-white shadow-soft">
            <div className="relative aspect-[4/3] select-none overflow-hidden bg-muted">
              <Image
                src="/images/before-after/after-treatment.svg"
                alt="After treatment placeholder"
                fill
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="object-cover"
                priority={false}
              />
              <div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${sliderValue}%` }}
              >
                <Image
                  src="/images/before-after/before-treatment.svg"
                  alt="Before treatment placeholder"
                  fill
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  className="max-w-none object-cover"
                  priority={false}
                />
              </div>

              <div
                className="absolute inset-y-0 z-10 w-1 -translate-x-1/2 bg-white shadow-[0_0_0_999px_rgba(0,0,0,0.02)]"
                style={{ left: `${sliderValue}%` }}
              >
                <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-primary shadow-soft">
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>

              <div className="absolute left-4 top-4 rounded-md bg-foreground/78 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
                Before Treatment
              </div>
              <div className="absolute right-4 top-4 rounded-md bg-primary px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground">
                After Treatment
              </div>

              <input
                type="range"
                min="8"
                max="92"
                value={sliderValue}
                onChange={(event) => setSliderValue(Number(event.target.value))}
                className="absolute inset-x-4 bottom-5 z-20 h-2 cursor-ew-resize appearance-none rounded-full bg-white/70 accent-primary"
                aria-label="Compare before and after treatment"
                aria-valuetext={`${sliderValue}% before treatment image visible`}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <InfoPanel
            title="Before Treatment"
            text="The initial condition may include stains, uneven shade, small defects, decay, or smile concerns that require a clinical consultation."
          />
          <InfoPanel
            title="After Treatment"
            text="The final result depends on diagnosis, treatment type, tooth condition, oral hygiene, and follow-up care."
          />
          <InfoPanel
            title="Treatment Description"
            text="This showcase can represent services such as scaling, cosmetic filling, crown planning, or smile enhancement after real case photos are approved."
          />

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
            <div className="flex gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
              <div>
                <h3 className="font-bold text-amber-950">Clinical disclaimer</h3>
                <p className="mt-2 text-sm leading-7 text-amber-900">
                  Images are placeholders. Actual treatment results vary from patient to patient.
                  A consultation with Dr. Md. Iqbal Hossain is required before recommending any treatment.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
            <h3 className="font-bold">Ready to discuss your smile?</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Book a personal consultation at Khidmah Dental Surgery, Beanibazar.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button asChild>
                <a href={whatsappUrl} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={telHref}>
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call
                </a>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function InfoPanel({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p>
    </div>
  );
}
