"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";

export function ImageUploader({
  value,
  onChange,
  aspectClassName = "aspect-square",
}: {
  value: string;
  onChange: (url: string) => void;
  aspectClassName?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        {value ? (
          <div className={`relative ${aspectClassName} w-24 shrink-0 overflow-hidden rounded-lg bg-light`}>
            <Image src={value} alt="" fill sizes="96px" className="object-cover" />
          </div>
        ) : (
          <div
            className={`flex ${aspectClassName} w-24 shrink-0 items-center justify-center rounded-lg bg-light text-gray-400`}
          >
            <Upload className="h-5 w-5" />
          </div>
        )}
        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-primary hover:border-accent disabled:opacity-50"
          >
            {uploading ? "Uploading..." : value ? "Change Image" : "Upload Image"}
          </button>
          {value && !uploading && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="ml-2 text-sm text-gray-500 hover:text-red-600"
            >
              Remove
            </button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onFileSelected}
        className="hidden"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
