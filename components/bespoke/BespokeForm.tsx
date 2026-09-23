"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { bespokeSchema, type BespokeFormValues } from "@/lib/validation/bespoke";

export function BespokeForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BespokeFormValues>({
    resolver: zodResolver(bespokeSchema),
    defaultValues: { garmentType: "Dress", budget: "₦200,000 – ₦500,000" },
  });

  async function onSubmit(values: BespokeFormValues) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bespoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Something went wrong. Please try again.");
      setSubmitted(true);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-light p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-accent" />
        <h3 className="font-bold text-xl text-primary">Request Received</h3>
        <p className="max-w-md text-gray-600">
          Thank you for sharing your vision. Our design team will reach out within 2 business
          days to discuss your bespoke piece.
        </p>
        <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-2">
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full Name" error={errors.fullName?.message}>
          <input {...register("fullName")} className="input" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" {...register("email")} className="input" />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input {...register("phone")} className="input" />
        </Field>
        <Field label="Garment Type" error={errors.garmentType?.message}>
          <select {...register("garmentType")} className="input">
            <option>Dress</option>
            <option>Suit</option>
            <option>Native Wear</option>
            <option>Other</option>
          </select>
        </Field>
        <Field label="Occasion" error={errors.occasion?.message}>
          <input {...register("occasion")} placeholder="e.g. Wedding, Gala" className="input" />
        </Field>
        <Field label="Budget" error={errors.budget?.message}>
          <select {...register("budget")} className="input">
            <option>Under ₦200,000</option>
            <option>₦200,000 – ₦500,000</option>
            <option>Over ₦500,000</option>
          </select>
        </Field>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-primary">Measurements (cm, optional)</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Bust">
            <input {...register("bust")} className="input" />
          </Field>
          <Field label="Waist">
            <input {...register("waist")} className="input" />
          </Field>
          <Field label="Hips">
            <input {...register("hips")} className="input" />
          </Field>
          <Field label="Height">
            <input {...register("height")} className="input" />
          </Field>
        </div>
      </div>

      <Field label="Tell us about your vision" error={errors.details?.message}>
        <textarea
          {...register("details")}
          rows={5}
          placeholder="Fabric preferences, color, inspiration, timeline..."
          className="input resize-none"
        />
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Bespoke Request"}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
