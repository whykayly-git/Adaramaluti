"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Star, Trash2 } from "lucide-react";
import type { Testimonial } from "@/lib/db";

export function TestimonialsTable({ testimonials }: { testimonials: Testimonial[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function onDelete(id: number, name: string) {
    if (!window.confirm(`Remove the testimonial from "${name}"? This can't be undone.`)) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  if (testimonials.length === 0) {
    return <p className="mt-3 text-sm text-gray-500">No testimonials yet.</p>;
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((t) => (
        <div key={t.id} className="rounded-2xl bg-white p-5">
          <div className="flex gap-1 text-accent">
            {Array.from({ length: t.rating }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-current" />
            ))}
          </div>
          <p className="mt-3 line-clamp-4 text-sm text-gray-600">&ldquo;{t.quote}&rdquo;</p>
          <p className="mt-3 text-sm font-semibold text-primary">
            {t.name} <span className="font-normal text-gray-400">— {t.location}</span>
          </p>
          <div className="mt-3 flex items-center gap-3">
            <Link
              href={`/admin/testimonials/${t.id}`}
              className="flex items-center gap-1 text-sm text-accent hover:underline"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Link>
            <button
              type="button"
              disabled={deletingId === t.id}
              onClick={() => onDelete(t.id, t.name)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
