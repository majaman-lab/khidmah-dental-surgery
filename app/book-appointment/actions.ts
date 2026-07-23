"use server";

import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

import { appointmentSchema, type AppointmentValues } from "@/lib/appointment-schema";

type AppointmentActionState =
  | {
      ok: true;
      successUrl: string;
    }
  | {
      ok: false;
      error: string;
    };

const recipientEmail = "drmdiqbalhussain@gmail.com";
const whatsappNumber = "8801727529609";

export async function submitAppointment(
  values: AppointmentValues,
): Promise<AppointmentActionState> {
  const parsed = appointmentSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the form fields and try again.",
    };
  }

  const data = parsed.data;
  const savedAppointment = await saveAppointment(data);

  if (!savedAppointment.ok) {
    return savedAppointment;
  }

  const preferredDate = savedAppointment.preferredDate;
  const preferredTime = savedAppointment.preferredTime;
  const referenceNumber = savedAppointment.referenceNumber;
  const messageLines = [
    "New Appointment Request - Khidmah Dental Surgery",
    `Patient Name: ${data.fullName}`,
    `Phone: ${data.mobileNumber}`,
    `Service: ${data.serviceNeeded}`,
    `Preferred Date: ${preferredDate}`,
    `Preferred Time: ${preferredTime}`,
    `Reference Number: ${referenceNumber}`,
    "Status: Pending Confirmation",
    `Message: ${data.message || "No additional message"}`,
  ];
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    messageLines.join("\n"),
  )}`;

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "Khidmah Dental Surgery <onboarding@resend.dev>";

  if (!apiKey) {
    return {
      ok: false,
      error:
        "Email service is not configured yet. Please set RESEND_API_KEY in Vercel environment variables.",
    };
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      subject: "New Appointment Request - Khidmah Dental Surgery",
      replyTo: recipientEmail,
      text: messageLines.join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; color: #10282b; line-height: 1.6;">
          <h2>New Appointment Request - Khidmah Dental Surgery</h2>
          <p><strong>Patient Name:</strong> ${escapeHtml(data.fullName)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(data.mobileNumber)}</p>
          <p><strong>Service:</strong> ${escapeHtml(data.serviceNeeded)}</p>
          <p><strong>Preferred Date:</strong> ${escapeHtml(preferredDate)}</p>
          <p><strong>Preferred Time:</strong> ${escapeHtml(preferredTime)}</p>
          <p><strong>Reference Number:</strong> ${escapeHtml(referenceNumber)}</p>
          <p><strong>Status:</strong> Pending Confirmation</p>
          <p><strong>Message:</strong> ${escapeHtml(data.message || "No additional message")}</p>
        </div>
      `,
    });

    if (error) {
      return {
        ok: false,
        error: error.message || "Could not send appointment email. Please try again.",
      };
    }

    return {
      ok: true,
      successUrl: `/appointment/success?${new URLSearchParams({
        name: data.fullName,
        doctor: "Dr. Md. Iqbal Hossain",
        service: data.serviceNeeded,
        date: preferredDate,
        time: preferredTime,
        ref: referenceNumber,
        whatsapp: whatsappUrl,
      }).toString()}`,
    };
  } catch {
    return {
      ok: false,
      error: "Could not send appointment request. Please try again or call the chamber.",
    };
  }
}

async function saveAppointment(data: AppointmentValues): Promise<
  | {
      ok: true;
      preferredDate: string;
      preferredTime: string;
      referenceNumber: string;
    }
  | {
      ok: false;
      error: string;
    }
> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return {
      ok: false,
      error: "Online appointment slots are not configured yet. Please call or WhatsApp the chamber.",
    };
  }

  const supabase = createClient(url, anonKey);
  const referenceNumber = generateAppointmentReference();
  const { data: selectedSlot, error: slotError } = await supabase
    .from("appointment_slots")
    .select("id, slot_date, slot_time")
    .eq("id", data.appointmentSlotId)
    .eq("slot_date", data.preferredDate)
    .maybeSingle();

  if (slotError || !selectedSlot) {
    return {
      ok: false,
      error: "This appointment slot is no longer available. Please choose another slot.",
    };
  }

  const { error } = await supabase.rpc("book_appointment", {
    p_patient_name: data.fullName,
    p_mobile_number: data.mobileNumber,
    p_service_needed: data.serviceNeeded,
    p_appointment_slot_id: data.appointmentSlotId,
    p_message: data.message || "",
    p_reference_number: referenceNumber,
  });

  if (error) {
    return {
      ok: false,
      error: error.message || "This appointment slot is no longer available. Please choose another slot.",
    };
  }

  return {
    ok: true,
    preferredDate: selectedSlot.slot_date,
    preferredTime: selectedSlot.slot_time,
    referenceNumber,
  };
}

function generateAppointmentReference() {
  const datePart = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const randomPart = randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase();
  return `KDS-${datePart}-${randomPart}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
