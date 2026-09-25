"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { LookbookImage } from "@/lib/db";

export function LookbookManager({ images }: { images: LookbookImage[] }) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/lookbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, alt }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Could not add image");
      }
      setUrl("");
      setAlt("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add image");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: number) {
    setDeletingId(id);
    try {
      await fetch(`/api/admin/lookbook/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <form onSubmit={onAdd} className="flex flex-col gap-3 rounded-2xl bg-white p-6 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">Image URL</label>
          <input
            required
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">Alt text (optional)</label>
          <input value={alt} onChange={(e) => setAlt(e.target.value)} className="input" />
        </div>
        <Button type="submit" disabled={submitting} className="shrink-0">
          {submitting ? "Adding..." : "Add Image"}
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <div key={image.id} className="group relative overflow-hidden rounded-xl">
            <div className="relative aspect-[3/4] w-full">
              <Image src={image.url} alt={image.alt} fill sizes="240px" className="object-cover" />
            </div>
            <button
              type="button"
              disabled={deletingId === image.id}
              onClick={() => onDelete(image.id)}
              aria-label="Delete image"
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-600 opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
