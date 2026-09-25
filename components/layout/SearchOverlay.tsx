"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import type { Product } from "@/types";

export function SearchOverlay({
  open,
  onClose,
  products,
}: {
  open: boolean;
  onClose: () => void;
  products: Product[];
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clear query on close
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query, products]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-auto mt-24 w-full max-w-xl px-4">
        <div className="rounded-2xl bg-white p-4 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim()) {
                  router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
                  onClose();
                }
              }}
              type="search"
              placeholder="Search dresses, suits, native wear..."
              className="w-full border-none text-base outline-none placeholder:text-gray-400"
            />
            <button type="button" onClick={onClose} aria-label="Close search">
              <X className="h-5 w-5 text-gray-400 hover:text-primary" />
            </button>
          </div>

          {results.length > 0 && (
            <ul className="mt-3 divide-y divide-gray-50">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/shop/${p.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 py-2 hover:bg-light rounded-lg px-2"
                  >
                    <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-md bg-light">
                      <Image src={p.images[0]} alt="" fill sizes="40px" className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.category}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {query && results.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-500">No products found for &ldquo;{query}&rdquo;</p>
          )}
        </div>
      </div>
    </div>
  );
}
