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
const clinicPhone = "01727-529609";
const emergencyContact = "01727-529609";
const doctorName = "Dr. Md. Iqbal Hossain";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://khidmahdentalsurgery.com";

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
    `Email: ${data.email}`,
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

  await sendAppointmentEmails({
    patientName: data.fullName,
    patientEmail: data.email,
    mobileNumber: data.mobileNumber,
    service: data.serviceNeeded,
    date: preferredDate,
    time: preferredTime,
    referenceNumber,
    message: data.message || "No additional message",
    messageLines,
  });

  return {
    ok: true,
    successUrl: `/appointment/success?${new URLSearchParams({
      name: data.fullName,
      doctor: doctorName,
      service: data.serviceNeeded,
      date: preferredDate,
      time: preferredTime,
      ref: referenceNumber,
      whatsapp: whatsappUrl,
    }).toString()}`,
  };
}

async function sendAppointmentEmails({
  patientName,
  patientEmail,
  mobileNumber,
  service,
  date,
  time,
  referenceNumber,
  message,
  messageLines,
}: {
  patientName: string;
  patientEmail: string;
  mobileNumber: string;
  service: string;
  date: string;
  time: string;
  referenceNumber: string;
  message: string;
  messageLines: string[];
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "Khidmah Dental Surgery <onboarding@resend.dev>";

  if (!apiKey) {
    console.error("Appointment email skipped: RESEND_API_KEY is not configured.");
    return;
  }

  const resend = new Resend(apiKey);

  try {
    const [clinicEmail, patientEmailResult] = await Promise.allSettled([
      resend.emails.send({
        from: fromEmail,
        to: recipientEmail,
        subject: "New Appointment Request - Khidmah Dental Surgery",
        replyTo: patientEmail,
        text: messageLines.join("\n"),
        html: buildClinicEmailHtml({
          patientName,
          patientEmail,
          mobileNumber,
          service,
          date,
          time,
          referenceNumber,
          message,
        }),
      }),
      resend.emails.send({
        from: fromEmail,
        to: patientEmail,
        subject: `Appointment Request Received - ${referenceNumber}`,
        replyTo: recipientEmail,
        text: [
          "Appointment Request Received - Khidmah Dental Surgery",
          `Patient Name: ${patientName}`,
          `Appointment Date: ${date}`,
          `Time: ${time}`,
          `Doctor: ${doctorName}`,
          `Reference ID: ${referenceNumber}`,
          "Status: Pending Confirmation",
          `Contact Number: ${clinicPhone}`,
          `Emergency Contact: ${emergencyContact}`,
        ].join("\n"),
        html: buildPatientEmailHtml({
          patientName,
          service,
          date,
          time,
          referenceNumber,
        }),
      }),
    ]);

    logEmailFailure("clinic", clinicEmail);
    logEmailFailure("patient", patientEmailResult);
  } catch (error) {
    console.error("Appointment email failed:", error);
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
    p_patient_email: data.email,
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

function buildClinicEmailHtml({
  patientName,
  patientEmail,
  mobileNumber,
  service,
  date,
  time,
  referenceNumber,
  message,
}: {
  patientName: string;
  patientEmail: string;
  mobileNumber: string;
  service: string;
  date: string;
  time: string;
  referenceNumber: string;
  message: string;
}) {
  return `
    <div style="margin:0;background:#f4f7f6;padding:28px;font-family:Arial,sans-serif;color:#10282b;">
      <div style="margin:0 auto;max-width:640px;border:1px solid #d9e5e1;background:#ffffff;border-radius:14px;overflow:hidden;">
        <div style="padding:24px 28px;border-bottom:1px solid #e5eeeb;">
          <img src="${siteUrl}/logo.svg" alt="Khidmah Dental Surgery" width="48" height="48" style="display:block;margin-bottom:14px;" />
          <h1 style="margin:0;font-size:24px;line-height:1.25;">New Appointment Request</h1>
          <p style="margin:8px 0 0;color:#4f6363;">Khidmah Dental Surgery, Beanibazar</p>
        </div>
        <div style="padding:24px 28px;">
          ${emailRow("Patient Name", patientName)}
          ${emailRow("Email", patientEmail)}
          ${emailRow("Mobile Number", mobileNumber)}
          ${emailRow("Service", service)}
          ${emailRow("Appointment Date", date)}
          ${emailRow("Time", time)}
          ${emailRow("Doctor", doctorName)}
          ${emailRow("Reference ID", referenceNumber)}
          ${emailRow("Status", "Pending Confirmation")}
          ${emailRow("Message", message)}
        </div>
        ${emailFooter()}
      </div>
    </div>
  `;
}

function buildPatientEmailHtml({
  patientName,
  service,
  date,
  time,
  referenceNumber,
}: {
  patientName: string;
  service: string;
  date: string;
  time: string;
  referenceNumber: string;
}) {
  return `
    <div style="margin:0;background:#f4f7f6;padding:28px;font-family:Arial,sans-serif;color:#10282b;">
      <div style="margin:0 auto;max-width:640px;border:1px solid #d9e5e1;background:#ffffff;border-radius:14px;overflow:hidden;">
        <div style="padding:28px;border-bottom:1px solid #e5eeeb;text-align:center;">
          <img src="${siteUrl}/logo.svg" alt="Khidmah Dental Surgery" width="56" height="56" style="display:block;margin:0 auto 16px;" />
          <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:2px;color:#1f8f5f;text-transform:uppercase;">Appointment Request Received</p>
          <h1 style="margin:0;font-size:26px;line-height:1.25;">Thank you, ${escapeHtml(patientName)}</h1>
          <p style="margin:12px 0 0;color:#4f6363;line-height:1.7;">Your appointment request has been received and is pending confirmation from Khidmah Dental Surgery.</p>
        </div>
        <div style="padding:24px 28px;">
          ${emailRow("Patient Name", patientName)}
          ${emailRow("Appointment Date", date)}
          ${emailRow("Time", time)}
          ${emailRow("Doctor", doctorName)}
          ${emailRow("Service", service)}
          ${emailRow("Reference ID", referenceNumber)}
          ${emailRow("Status", "Pending Confirmation")}
          ${emailRow("Contact Number", clinicPhone)}
          ${emailRow("Emergency Contact", emergencyContact)}
        </div>
        ${emailFooter()}
      </div>
    </div>
  `;
}

function emailRow(label: string, value: string) {
  return `
    <div style="padding:13px 0;border-bottom:1px solid #edf3f1;">
      <div style="font-size:12px;font-weight:700;letter-spacing:1.4px;color:#6d7f7f;text-transform:uppercase;">${escapeHtml(label)}</div>
      <div style="margin-top:5px;font-size:16px;font-weight:700;color:#10282b;">${escapeHtml(value)}</div>
    </div>
  `;
}

function emailFooter() {
  return `
    <div style="padding:20px 28px;background:#10282b;color:#ffffff;">
      <p style="margin:0;font-weight:700;">Khidmah Dental Surgery</p>
      <p style="margin:6px 0 0;color:#c9d7d4;line-height:1.6;">Nimar Ali Mansion (2nd Floor), Nimtola, Beanibazar, Sylhet 3170</p>
      <p style="margin:10px 0 0;color:#c9d7d4;">Phone: ${clinicPhone} | Email: ${recipientEmail}</p>
    </div>
  `;
}

function logEmailFailure(label: string, result: PromiseSettledResult<{ error: unknown }>) {
  if (result.status === "rejected") {
    console.error(`Appointment ${label} email failed:`, result.reason);
    return;
  }

  if (result.value.error) {
    console.error(`Appointment ${label} email failed:`, result.value.error);
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
