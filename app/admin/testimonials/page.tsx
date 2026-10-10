import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { TestimonialsTable } from "@/components/admin/testimonials/TestimonialsTable";
import { listTestimonials } from "@/lib/db";

export const metadata: Metadata = { title: "Manage Testimonials", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function AdminTestimonialsPage() {
  const testimonials = listTestimonials();

  return (
    <AdminShell activePath="/admin/testimonials">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl text-primary">Client Love</h1>
          <p className="mt-1 text-sm text-gray-500">
            {testimonials.length} testimonials shown on the home page
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> Add Testimonial
        </Link>
      </div>

      <TestimonialsTable testimonials={testimonials} />
    </AdminShell>
  );
}
