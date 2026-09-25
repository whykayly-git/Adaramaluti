"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { slugify } from "@/lib/slugify";
import type { Product } from "@/types";

const CATEGORIES = ["Dresses", "Suits", "Native Wear", "Accessories"] as const;

interface ProductFormProps {
  productId?: string;
  initial?: Product;
  collectionNames: string[];
}

export function ProductForm({ productId, initial, collectionNames }: ProductFormProps) {
  const router = useRouter();
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [name, setName] = useState(initial?.name ?? "");
  const [priceNGN, setPriceNGN] = useState(initial ? String(initial.priceNGN) : "");
  const [salePriceNGN, setSalePriceNGN] = useState(
    initial?.salePriceNGN ? String(initial.salePriceNGN) : ""
  );
  const [category, setCategory] = useState<Product["category"]>(initial?.category ?? "Dresses");
  const [collection, setCollection] = useState(initial?.collection ?? "");
  const [sizes, setSizes] = useState(initial?.sizes.join(", ") ?? "");
  const [colors, setColors] = useState(initial?.colors.join(", ") ?? "");
  const [images, setImages] = useState(initial?.images.join("\n") ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [inStock, setInStock] = useState(initial?.inStock ?? true);
  const [featured, setFeatured] = useState(initial?.featured ?? false);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function onNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload = {
      slug,
      name,
      priceNGN: Number(priceNGN),
      salePriceNGN: salePriceNGN ? Number(salePriceNGN) : null,
      category,
      collection,
      sizes: sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      colors: colors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      images: images
        .split("\n")
        .map((i) => i.trim())
        .filter(Boolean),
      description,
      inStock,
      featured,
    };

    try {
      const res = await fetch(productId ? `/api/admin/products/${productId}` : "/api/admin/products", {
        method: productId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Could not save product");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save product");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl bg-white p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input
            required
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Slug">
          <input
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className="input"
          />
        </Field>
        <Field label="Price (NGN)">
          <input
            type="number"
            min={0}
            required
            value={priceNGN}
            onChange={(e) => setPriceNGN(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Sale Price (NGN, optional)">
          <input
            type="number"
            min={0}
            value={salePriceNGN}
            onChange={(e) => setSalePriceNGN(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Category">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Product["category"])}
            className="input"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Collection">
          <input
            required
            list="collection-names"
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            className="input"
          />
          <datalist id="collection-names">
            {collectionNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </Field>
        <Field label="Sizes (comma-separated)">
          <input
            required
            placeholder="XS, S, M, L, XL"
            value={sizes}
            onChange={(e) => setSizes(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Colors (comma-separated)">
          <input
            required
            placeholder="Ivory, Champagne"
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            className="input"
          />
        </Field>
      </div>

      <Field label="Image URLs (one per line)">
        <textarea
          required
          rows={3}
          value={images}
          onChange={(e) => setImages(e.target.value)}
          className="input resize-none"
        />
      </Field>

      <Field label="Description">
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input resize-none"
        />
      </Field>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          In Stock
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Featured on Home
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : productId ? "Save Changes" : "Create Product"}
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}
