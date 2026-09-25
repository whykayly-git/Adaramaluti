"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import type { Product } from "@/types";

export function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function onDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  if (products.length === 0) {
    return <p className="mt-3 text-sm text-gray-500">No products yet.</p>;
  }

  return (
    <div className="mt-4 overflow-x-auto rounded-2xl bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-gray-500">
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Featured</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-gray-50">
              <td className="flex items-center gap-3 px-4 py-3">
                <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-md bg-light">
                  <Image src={product.images[0]} alt="" fill sizes="36px" className="object-cover" />
                </div>
                <span className="font-medium text-primary">{product.name}</span>
              </td>
              <td className="px-4 py-3 text-gray-600">{product.category}</td>
              <td className="px-4 py-3 text-gray-600">₦{product.priceNGN.toLocaleString()}</td>
              <td className="px-4 py-3">
                <span
                  className={
                    product.inStock
                      ? "rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                      : "rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500"
                  }
                >
                  {product.inStock ? "In Stock" : "Sold Out"}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">{product.featured ? "Yes" : "—"}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/admin/products/${product.id}`}
                    aria-label={`Edit ${product.name}`}
                    className="text-gray-500 hover:text-accent"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    disabled={deletingId === product.id}
                    onClick={() => onDelete(product.id, product.name)}
                    aria-label={`Delete ${product.name}`}
                    className="text-gray-500 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
