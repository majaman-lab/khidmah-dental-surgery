import { z } from "zod";

export const appointmentSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  mobileNumber: z
    .string()
    .trim()
    .min(1, "Mobile number is required")
    .refine(
      (value) => /^(?:\+?88)?01[3-9]\d{8}$/.test(value.replace(/[\s-]/g, "")),
      "Enter a valid Bangladesh mobile number",
    ),
  serviceNeeded: z.string().min(1, "Please select a service"),
  preferredDate: z.string().min(1, "Preferred date is required"),
  preferredTime: z.string().min(1, "Preferred time is required"),
  message: z.string().trim().optional(),
});

export type AppointmentValues = z.infer<typeof appointmentSchema>;

export const appointmentServices = [
  "Root Canal Treatment",
  "Scaling & Polishing",
  "Cosmetic Filling",
  "Crown & Bridge",
  "Braces Consultation",
  "Smile Enhancement",
];

export const appointmentTimes = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
];
