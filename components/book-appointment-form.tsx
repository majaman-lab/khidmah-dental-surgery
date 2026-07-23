"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { AlertCircle, CalendarCheck, CheckCircle2, Loader2, Send } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { submitAppointment } from "@/app/book-appointment/actions";
import { Button } from "@/components/ui/button";
import {
  appointmentSchema,
  appointmentServices,
  type AppointmentValues,
} from "@/lib/appointment-schema";
import { cn } from "@/lib/utils";

type AppointmentSlot = {
  id: string;
  slot_date: string;
  slot_time: string;
  note: string;
};

export function BookAppointmentForm() {
  const [isPending, startTransition] = useTransition();
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");
  const [status, setStatus] = useState<
    | {
        type: "success";
        message: string;
      }
    | {
        type: "error";
        message: string;
      }
    | null
  >(null);
  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AppointmentValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      fullName: "",
      mobileNumber: "",
      serviceNeeded: "",
      preferredDate: "",
      preferredTime: "",
      appointmentSlotId: "",
      message: "",
    },
  });
  const selectedDate = watch("preferredDate");
  const selectedSlotId = watch("appointmentSlotId");

  useEffect(() => {
    let cancelled = false;

    setValue("appointmentSlotId", "");
    setValue("preferredTime", "");
    setSlots([]);
    setSlotsError("");

    if (!selectedDate) {
      return () => {
        cancelled = true;
      };
    }

    setSlotsLoading(true);

    fetch(`/api/appointment-slots?date=${encodeURIComponent(selectedDate)}`, {
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((data: { configured?: boolean; slots?: AppointmentSlot[]; error?: string }) => {
        if (cancelled) {
          return;
        }

        if (data.configured === false) {
          setSlotsError("Online slot booking is not configured yet. Please call or WhatsApp the chamber.");
          return;
        }

        if (data.error) {
          setSlotsError(data.error);
          return;
        }

        setSlots(data.slots || []);
      })
      .catch(() => {
        if (!cancelled) {
          setSlotsError("Could not load available slots. Please try again.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setSlotsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate, setValue]);

  function onSubmit(values: AppointmentValues) {
    setStatus(null);

    startTransition(async () => {
      const result = await submitAppointment(values);

      if (!result.ok) {
        setStatus({ type: "error", message: result.error });
        return;
      }

      setStatus({
        type: "success",
        message: "Appointment request received. Redirecting to confirmation...",
      });
      reset();
      setSlots([]);

      window.setTimeout(() => {
        window.location.href = result.successUrl;
      }, 700);
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-lg border border-white bg-white p-5 shadow-soft sm:p-8"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <CalendarCheck className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Appointment Request</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal">Book a chamber visit</h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            Submit your preferred date and available time slot. The chamber will receive an email
            notification, then you will see your appointment reference.
          </p>
        </div>
      </div>

      {status ? (
        <div
          className={cn(
            "mt-6 flex gap-3 rounded-lg border p-4 text-sm font-medium",
            status.type === "success"
              ? "border-[#1f8f5f]/20 bg-[#1f8f5f]/8 text-primary"
              : "border-red-200 bg-red-50 text-red-700",
          )}
          role="status"
          aria-live="polite"
        >
          {status.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          )}
          <p>{status.message}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full Name" error={errors.fullName?.message} errorId="fullName-error">
            <input
              {...register("fullName")}
              id="fullName"
              autoComplete="name"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              className={inputClass(Boolean(errors.fullName))}
              placeholder="Patient full name"
            />
          </Field>

          <Field label="Mobile Number" error={errors.mobileNumber?.message} errorId="mobileNumber-error">
            <input
              {...register("mobileNumber")}
              id="mobileNumber"
              autoComplete="tel"
              inputMode="tel"
              aria-invalid={Boolean(errors.mobileNumber)}
              aria-describedby={errors.mobileNumber ? "mobileNumber-error" : undefined}
              className={inputClass(Boolean(errors.mobileNumber))}
              placeholder="01XXXXXXXXX"
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
            {appointmentServices.map((service) => (
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

          <Field label="Available Time Slot" error={errors.appointmentSlotId?.message || errors.preferredTime?.message} errorId="appointmentSlotId-error">
            <input type="hidden" {...register("appointmentSlotId")} />
            <input type="hidden" {...register("preferredTime")} />
            <div
              id="appointmentSlotId"
              aria-invalid={Boolean(errors.appointmentSlotId || errors.preferredTime)}
              aria-describedby={errors.appointmentSlotId || errors.preferredTime ? "appointmentSlotId-error" : undefined}
              className={cn(
                "min-h-12 rounded-md border bg-background p-2",
                errors.appointmentSlotId || errors.preferredTime ? "border-red-400" : "border-border",
              )}
            >
              {!selectedDate ? (
                <p className="px-2 py-2 text-sm font-medium text-muted-foreground">Choose a date first.</p>
              ) : slotsLoading ? (
                <p className="flex items-center gap-2 px-2 py-2 text-sm font-semibold text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Loading available slots...
                </p>
              ) : slotsError ? (
                <p className="px-2 py-2 text-sm font-semibold text-red-600">{slotsError}</p>
              ) : slots.length ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => {
                        setValue("appointmentSlotId", slot.id, { shouldDirty: true, shouldValidate: true });
                        setValue("preferredTime", slot.slot_time, { shouldDirty: true, shouldValidate: true });
                      }}
                      className={cn(
                        "h-10 rounded-md border px-3 text-sm font-bold transition",
                        selectedSlotId === slot.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-white text-muted-foreground hover:text-primary",
                      )}
                    >
                      {formatSlotTime(slot.slot_time)}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="px-2 py-2 text-sm font-semibold text-muted-foreground">
                  No available slots for this date. Please choose another date.
                </p>
              )}
            </div>
          </Field>
        </div>

        <Field label="Additional Message" error={errors.message?.message} errorId="message-error">
          <textarea
            {...register("message")}
            id="message"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={cn(inputClass(Boolean(errors.message)), "min-h-28 resize-y py-3")}
            placeholder="Write pain details, preferred note, or concern"
          />
        </Field>

        <Button type="submit" size="lg" disabled={isPending} className="h-13 bg-[#1f8f5f] hover:bg-[#18764f]">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
          {isPending ? "Sending request..." : "Submit Appointment Request"}
        </Button>
      </form>
    </motion.div>
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

function Field({
  label,
  error,
  errorId,
  children,
}: {
  label: string;
  error?: string;
  errorId: string;
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
