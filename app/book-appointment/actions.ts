"use server";

import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

import { appointmentSchema, type AppointmentValues } from "@/lib/appointment-schema";

type AppointmentActionState =
  | {
      ok: true;
      whatsappUrl: string;
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
  await saveAppointment(data);
  const messageLines = [
    "New Appointment Request - Khidmah Dental Surgery",
    `Patient Name: ${data.fullName}`,
    `Phone: ${data.mobileNumber}`,
    `Service: ${data.serviceNeeded}`,
    `Preferred Date: ${data.preferredDate}`,
    `Preferred Time: ${data.preferredTime}`,
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
          <p><strong>Preferred Date:</strong> ${escapeHtml(data.preferredDate)}</p>
          <p><strong>Preferred Time:</strong> ${escapeHtml(data.preferredTime)}</p>
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
      whatsappUrl,
    };
  } catch {
    return {
      ok: false,
      error: "Could not send appointment request. Please try again or call the chamber.",
    };
  }
}

async function saveAppointment(data: AppointmentValues) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return;
  }

  const supabase = createClient(url, anonKey);
  await supabase.from("appointments").insert({
    patient_name: data.fullName,
    mobile_number: data.mobileNumber,
    service_needed: data.serviceNeeded,
    preferred_date: data.preferredDate,
    preferred_time: data.preferredTime,
    message: data.message || "",
    status: "Pending",
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
