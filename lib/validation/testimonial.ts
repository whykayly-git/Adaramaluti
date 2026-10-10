import { z } from "zod";

export const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  quote: z.string().min(10, "Quote should be at least 10 characters"),
  rating: z.number().int().min(1).max(5),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;
