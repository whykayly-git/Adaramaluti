import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { TestimonialForm } from "@/components/admin/testimonials/TestimonialForm";

export const metadata: Metadata = { title: "Add Testimonial", robots: { index: false } };

export default function NewTestimonialPage() {
  return (
    <AdminShell activePath="/admin/testimonials">
      <h1 className="font-bold text-3xl text-primary">Add Testimonial</h1>
      <div className="mt-6">
        <TestimonialForm />
      </div>
    </AdminShell>
  );
}
