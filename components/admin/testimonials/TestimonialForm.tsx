"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { Testimonial } from "@/lib/db";

interface TestimonialFormProps {
  testimonialId?: number;
  initial?: Testimonial;
}

export function TestimonialForm({ testimonialId, initial }: TestimonialFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [quote, setQuote] = useState(initial?.quote ?? "");
  const [rating, setRating] = useState(initial?.rating ?? 5);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(
        testimonialId ? `/api/admin/testimonials/${testimonialId}` : "/api/admin/testimonials",
        {
          method: testimonialId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, location, quote, rating }),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Could not save testimonial");
      }
      router.push("/admin/testimonials");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save testimonial");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl bg-white p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
          <input
            required
            placeholder="Ngozi A."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
          <input
            required
            placeholder="Lagos, Nigeria"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="input w-32"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} star{n === 1 ? "" : "s"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Quote</label>
        <textarea
          required
          rows={4}
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          className="input resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : testimonialId ? "Save Changes" : "Add Testimonial"}
      </Button>
    </form>
  );
}
