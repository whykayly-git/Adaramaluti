"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { PageContentKey } from "@/lib/page-content";

const SECTIONS: { key: PageContentKey; label: string; rows: number; hint: string }[] = [
  {
    key: "contact_intro",
    label: "Contact Page Intro",
    rows: 2,
    hint: "One short line shown above the contact form.",
  },
  {
    key: "shipping_returns",
    label: "Shipping & Returns",
    rows: 12,
    hint: 'Use "## Heading" for section headings, "- item" for bullet lists, blank lines between blocks. The shipping rates table itself is generated automatically and isn\'t part of this text.',
  },
  {
    key: "privacy_policy",
    label: "Privacy Policy",
    rows: 12,
    hint: 'Use "## Heading" for section headings, "- item" for bullet lists, blank lines between blocks.',
  },
  {
    key: "terms",
    label: "Terms of Service",
    rows: 12,
    hint: 'Use "## Heading" for section headings, "- item" for bullet lists, blank lines between blocks.',
  },
];

export function PageContentEditor({ initial }: { initial: Record<PageContentKey, string> }) {
  return (
    <div className="space-y-6">
      {SECTIONS.map((section) => (
        <PageContentSection
          key={section.key}
          contentKey={section.key}
          label={section.label}
          rows={section.rows}
          hint={section.hint}
          initial={initial[section.key]}
        />
      ))}
    </div>
  );
}

function PageContentSection({
  contentKey,
  label,
  rows,
  hint,
  initial,
}: {
  contentKey: PageContentKey;
  label: string;
  rows: number;
  hint: string;
  initial: string;
}) {
  const router = useRouter();
  const [content, setContent] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/page-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: contentKey, content }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Could not save");
      }
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6">
      <h3 className="font-bold text-primary">{label}</h3>
      <p className="mt-1 text-xs text-gray-500">{hint}</p>
      <textarea
        rows={rows}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setSaved(false);
        }}
        className="input mt-3 resize-y font-mono text-xs"
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-3 flex items-center gap-3">
        <Button type="submit" size="sm" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </Button>
        {saved && <span className="text-sm text-accent">Saved</span>}
      </div>
    </form>
  );
}
