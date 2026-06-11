"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CalendarCheck, CheckCircle2, MessageCircle, Phone, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const appointmentSchema = z.object({
  patientName: z.string().trim().min(2, "Patient name is required"),
  mobileNumber: z
    .string()
    .trim()
    .min(1, "Mobile number is required")
    .regex(
      /^(?:\+?88)?01[3-9]\d{8}$/,
      "Enter a valid Bangladesh mobile number",
    ),
  serviceNeeded: z.string().min(1, "Please select a service"),
  preferredDate: z.string().min(1, "Preferred date is required"),
  preferredTime: z.string().min(1, "Preferred time is required"),
  message: z.string().trim().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

const services = [
  "Root Canal Treatment",
  "Scaling & Polishing",
  "Cosmetic Filling",
  "Crown & Bridge",
  "Braces Consultation",
  "Smile Enhancement",
];

const timeSlots = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
];

const chamberPhone = "01727-529609";
const chamberWhatsapp = "8801727529609";
const telHref = `tel:${chamberPhone}`;

export function AppointmentForm() {
  const [successMessage, setSuccessMessage] = useState("");

  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientName: "",
      mobileNumber: "",
      serviceNeeded: "",
      preferredDate: "",
      preferredTime: "",
      message: "",
    },
  });

  function onSubmit(values: AppointmentFormValues) {
    const lines = [
      "Appointment Request - Khidmah Dental Surgery",
      `Patient Name: ${values.patientName}`,
      `Mobile Number: ${values.mobileNumber}`,
      `Service Needed: ${values.serviceNeeded}`,
      `Preferred Date: ${values.preferredDate}`,
      `Preferred Time: ${values.preferredTime}`,
      values.message ? `Message: ${values.message}` : "",
    ].filter(Boolean);

    const whatsappUrl = `https://wa.me/${chamberWhatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
    setSuccessMessage("Appointment request prepared. Redirecting to WhatsApp...");

    window.setTimeout(() => {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      reset();
      setSuccessMessage("Your request was prepared successfully. If WhatsApp did not open, please call the chamber.");
    }, 450);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-lg border border-white bg-white p-5 shadow-soft sm:p-7"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <CalendarCheck className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Appointment</p>
          <h2 className="mt-2 text-2xl font-bold tracking-normal sm:text-3xl">
            Request a chamber visit
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Submit your preferred time and the request will open in WhatsApp for quick confirmation.
          </p>
        </div>
      </div>

      {successMessage ? (
        <div className="mt-6 flex gap-3 rounded-lg border border-[#1f8f5f]/20 bg-[#1f8f5f]/8 p-4 text-sm font-medium text-primary">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>{successMessage}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Patient Name" error={errors.patientName?.message} errorId="patientName-error">
            <input
              {...register("patientName")}
              id="patientName"
              aria-invalid={Boolean(errors.patientName)}
              aria-describedby={errors.patientName ? "patientName-error" : undefined}
              className={inputClass(Boolean(errors.patientName))}
              placeholder="Full name"
              autoComplete="name"
            />
          </Field>

          <Field label="Mobile Number" error={errors.mobileNumber?.message} errorId="mobileNumber-error">
            <input
              {...register("mobileNumber")}
              id="mobileNumber"
                aria-invalid={Boolean(errors.mobileNumber)}
                aria-describedby={errors.mobileNumber ? "mobileNumber-error" : undefined}
                className={inputClass(Boolean(errors.mobileNumber))}
                placeholder="01XXXXXXXXX"
                autoComplete="tel"
                inputMode="tel"
              />
          </Field>
        </div>

        <Field label="Service Needed" error={errors.serviceNeeded?.message} errorId="serviceNeeded-error">
          <select
            {...register("serviceNeeded")}
            id="serviceNeeded"
            aria-invalid={Boolean(errors.serviceNeeded)}
            aria-describedby={errors.serviceNeeded ? "serviceNeeded-error" : undefined}
            className={inputClass(Boolean(errors.serviceNeeded))}
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Preferred Date" error={errors.preferredDate?.message} errorId="preferredDate-error">
            <input
              {...register("preferredDate")}
              id="preferredDate"
              type="date"
              min={minDate}
              aria-invalid={Boolean(errors.preferredDate)}
              aria-describedby={errors.preferredDate ? "preferredDate-error" : undefined}
              className={inputClass(Boolean(errors.preferredDate))}
            />
          </Field>

          <Field label="Preferred Time" error={errors.preferredTime?.message} errorId="preferredTime-error">
            <select
              {...register("preferredTime")}
              id="preferredTime"
              aria-invalid={Boolean(errors.preferredTime)}
              aria-describedby={errors.preferredTime ? "preferredTime-error" : undefined}
              className={inputClass(Boolean(errors.preferredTime))}
            >
              <option value="">Select a time</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Message" error={errors.message?.message} errorId="message-error">
          <textarea
            {...register("message")}
            id="message"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={cn(inputClass(Boolean(errors.message)), "min-h-28 resize-y py-3")}
            placeholder="Briefly describe pain, concern, or preferred note"
          />
        </Field>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <Button type="submit" size="lg" disabled={isSubmitting} className="h-13 bg-[#1f8f5f] hover:bg-[#18764f]">
            <Send className="h-4 w-4" aria-hidden="true" />
            Send to WhatsApp
          </Button>
          <Button type="button" variant="outline" size="lg" asChild>
            <a href={telHref}>
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call Instead
            </a>
          </Button>
        </div>

        <p className="text-xs leading-5 text-muted-foreground">
          WhatsApp confirmation is required. For urgent dental pain, call the chamber directly.
        </p>
      </form>
    </motion.div>
  );
}

function Field({
  label,
  error,
  errorId,
  children,
}: {
  label: string;
  error?: string;
  errorId?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-foreground">{label}</span>
      {children}
      {error ? (
        <span id={errorId} className="text-sm font-semibold text-red-600">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "h-12 w-full rounded-md border bg-background px-4 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/18",
    hasError ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-border",
  );
}
