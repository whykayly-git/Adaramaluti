import { z } from "zod";

export const collectionSchema = z.object({
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers and hyphens only"),
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description should be at least 10 characters"),
  image: z.string().url("Enter a valid image URL"),
});

export type CollectionFormValues = z.infer<typeof collectionSchema>;
