import { z } from "zod";

export const siteSettingsSchema = z.object({
  name: z.string().min(2, "Brand name is required"),
  shortName: z.string().min(1, "Short name is required"),
  tagline: z.string().min(2, "Tagline is required"),
  description: z.string().min(10, "Description should be at least 10 characters"),
  url: z.string().url("Enter a valid URL"),
  logo: z.string().min(1, "Logo path/URL is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(5, "Enter a valid phone number"),
  whatsapp: z.string().min(5, "Enter a valid WhatsApp number (digits only, with country code)"),
  address: z.object({
    line1: z.string().min(1),
    line2: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
  }),
  social: z.object({
    instagram: z.string().url().or(z.literal("")),
    facebook: z.string().url().or(z.literal("")),
    twitter: z.string().url().or(z.literal("")),
    tiktok: z.string().url().or(z.literal("")),
    pinterest: z.string().url().or(z.literal("")),
  }),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

export const pageContentSchema = z.object({
  key: z.enum(["shipping_returns", "privacy_policy", "terms", "contact_intro"]),
  content: z.string().min(1, "Content can't be empty"),
});
