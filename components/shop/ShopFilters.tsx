"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { categories } from "@/data/products";
import { cn } from "@/lib/utils";

const SIZES = ["XS", "S", "M", "L", "XL", "One Size"];
const COLORS = [
  "Ivory",
  "Black",
  "Emerald",
  "Navy",
  "Charcoal",
  "Gold",
  "Blush",
  "Royal Blue",
  "Multicolor",
];
const PRICE_BANDS: { label: string; min?: number; max?: number }[] = [
  { label: "Under ₦100,000", max: 100000 },
  { label: "₦100,000 – ₦250,000", min: 100000, max: 250000 },
  { label: "₦250,000 – ₦400,000", min: 250000, max: 400000 },
  { label: "Over ₦400,000", min: 400000 },
];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

export function ShopFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCategory = searchParams.get("category") ?? "";
  const activeSize = searchParams.get("size") ?? "";
  const activeColor = searchParams.get("color") ?? "";
  const activePrice = searchParams.get("price") ?? "";
  const activeSort = searchParams.get("sort") ?? "newest";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    router.push(pathname);
  }

  const hasActiveFilters = activeCategory || activeSize || activeColor || activePrice;

  const content = (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold text-primary">Category</h3>
        <ul className="mt-3 space-y-2">
          {categories.map((c) => (
            <li key={c}>
              <button
                type="button"
                onClick={() => updateParam("category", activeCategory === c ? "" : c)}
                className={cn(
                  "text-sm text-gray-600 hover:text-accent",
                  activeCategory === c && "font-semibold text-accent"
                )}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-primary">Size</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => updateParam("size", activeSize === size ? "" : size)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium",
                activeSize === size
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 text-gray-600 hover:border-accent"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-primary">Color</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => updateParam("color", activeColor === color ? "" : color)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium",
                activeColor === color
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 text-gray-600 hover:border-accent"
              )}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-primary">Price</h3>
        <ul className="mt-3 space-y-2">
          {PRICE_BANDS.map((band) => {
            const value = `${band.min ?? ""}-${band.max ?? ""}`;
            return (
              <li key={band.label}>
                <button
                  type="button"
                  onClick={() => updateParam("price", activePrice === value ? "" : value)}
                  className={cn(
                    "text-sm text-gray-600 hover:text-accent",
                    activePrice === value && "font-semibold text-accent"
                  )}
                >
                  {band.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="text-sm font-semibold text-primary underline underline-offset-2"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
        <select
          value={activeSort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="rounded-full border border-gray-200 px-3 py-2 text-sm"
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <aside className="hidden lg:block">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-bold text-lg text-primary">Filters</h2>
        </div>
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-primary/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-full max-w-xs overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-bold text-lg text-primary">Filters</h2>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close filters">
                <X className="h-5 w-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}

export { SORT_OPTIONS };
