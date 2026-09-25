"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { ShippingOption } from "@/types";

export function ShippingRatesForm({ initial }: { initial: ShippingOption[] }) {
  const router = useRouter();
  const [options, setOptions] = useState<ShippingOption[]>(initial);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  function set(id: string, key: keyof ShippingOption, value: string | number) {
    setOptions((opts) => opts.map((o) => (o.id === id ? { ...o, [key]: value } : o)));
    setSaved(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/shipping", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Could not save shipping rates");
      }
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save shipping rates");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6">
      <h3 className="font-bold text-primary">Shipping Rates</h3>
      <p className="mt-1 text-xs text-gray-500">
        Shown at checkout and on the Shipping & Returns page. The three zones themselves are
        fixed — only the label, description, rate and delivery estimate are editable.
      </p>

      <div className="mt-4 space-y-6">
        {options.map((option) => (
          <div key={option.id} className="rounded-xl border border-gray-100 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent">
              {option.id}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Label</label>
                <input
                  required
                  value={option.label}
                  onChange={(e) => set(option.id, "label", e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Rate (NGN)
                </label>
                <input
                  required
                  type="number"
                  min={0}
                  value={option.rateNGN}
                  onChange={(e) => set(option.id, "rateNGN", Number(e.target.value))}
                  className="input"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  required
                  value={option.description}
                  onChange={(e) => set(option.id, "description", e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Delivery Estimate
                </label>
                <input
                  required
                  value={option.etaDays}
                  onChange={(e) => set(option.id, "etaDays", e.target.value)}
                  className="input"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-4 flex items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Shipping Rates"}
        </Button>
        {saved && <span className="text-sm text-accent">Saved</span>}
      </div>
    </form>
  );
}
