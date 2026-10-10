import { listTestimonials } from "@/lib/db";
import type { Testimonial } from "@/lib/db";

/**
 * "Client Love" testimonials shown on the home page, backed by the SQLite
 * database (see lib/db.ts) so they can be edited at /admin/testimonials.
 * Seeded once from data/seed-testimonials.ts.
 */
export function getAllTestimonials(): Testimonial[] {
  return listTestimonials();
}
