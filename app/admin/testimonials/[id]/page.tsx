import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { TestimonialForm } from "@/components/admin/testimonials/TestimonialForm";
import { getTestimonialById } from "@/lib/db";

export const metadata: Metadata = { title: "Edit Testimonial", robots: { index: false } };
export const dynamic = "force-dynamic";

interface EditTestimonialPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
  const { id } = await params;
  const testimonial = getTestimonialById(Number(id));
  if (!testimonial) notFound();

  return (
    <AdminShell activePath="/admin/testimonials">
      <h1 className="font-bold text-3xl text-primary">Edit Testimonial</h1>
      <div className="mt-6">
        <TestimonialForm testimonialId={testimonial.id} initial={testimonial} />
      </div>
    </AdminShell>
  );
}
