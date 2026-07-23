import { z } from "zod";

export const appointmentSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  mobileNumber: z
    .string()
    .trim()
    .min(1, "Mobile number is required")
    .refine(
      (value) => /^(?:\+?88)?01[3-9]\d{8}$/.test(value.replace(/[\s-]/g, "")),
      "Enter a valid Bangladesh mobile number",
    ),
  serviceNeeded: z.string().trim().min(1, "Please select a service"),
  preferredDate: z.string().trim().min(1, "Preferred date is required"),
  preferredTime: z.string().trim().min(1, "Preferred time is required"),
  appointmentSlotId: z.string().uuid("Please select an available appointment slot"),
  message: z.string().trim().optional(),
  turnstileToken: z.string().trim().optional(),
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
