"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Upload } from "lucide-react";
import type { LookbookImage } from "@/lib/db";

export function LookbookManager({ images }: { images: LookbookImage[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error ?? "Upload failed");

      const res = await fetch("/api/admin/lookbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: uploadData.url, alt }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Could not add image");
      }
      setAlt("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add image");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
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
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">Alt text (optional)</label>
          <input value={alt} onChange={(e) => setAlt(e.target.value)} className="input" />
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
        >
          <Upload className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload Image"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onFileSelected}
          className="hidden"
        />
      </div>
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
