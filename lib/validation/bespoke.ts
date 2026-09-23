import { z } from "zod";

export const bespokeSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  garmentType: z.enum(["Dress", "Suit", "Native Wear", "Other"]),
  occasion: z.string().min(2, "Tell us the occasion"),
  bust: z.string().optional(),
  waist: z.string().optional(),
  hips: z.string().optional(),
  height: z.string().optional(),
  budget: z.enum(["Under ₦200,000", "₦200,000 – ₦500,000", "Over ₦500,000"]),
  details: z.string().min(10, "Please share a few more details about your vision"),
});

export type BespokeFormValues = z.infer<typeof bespokeSchema>;
