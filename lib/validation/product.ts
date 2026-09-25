import { z } from "zod";

export const productSchema = z.object({
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers and hyphens only"),
  name: z.string().min(2, "Name is required"),
  priceNGN: z.number().positive("Price must be greater than 0"),
  salePriceNGN: z.number().positive().optional().nullable(),
  category: z.enum(["Dresses", "Suits", "Native Wear", "Accessories"]),
  collection: z.string().min(1, "Collection is required"),
  sizes: z.array(z.string().min(1)).min(1, "At least one size is required"),
  colors: z.array(z.string().min(1)).min(1, "At least one color is required"),
  images: z.array(z.string().url("Each image must be a valid URL")).min(1, "At least one image is required"),
  description: z.string().min(10, "Description should be at least 10 characters"),
  inStock: z.boolean(),
  featured: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
