"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import type { Collection } from "@/types";

export function CollectionsTable({ collections }: { collections: (Collection & { id: number })[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function onDelete(id: number, name: string) {
    if (!window.confirm(`Delete "${name}"? Products in this collection will keep the collection name as text.`)) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/collections/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  if (collections.length === 0) {
    return <p className="mt-3 text-sm text-gray-500">No collections yet.</p>;
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {collections.map((collection) => (
        <div key={collection.id} className="overflow-hidden rounded-2xl bg-white">
          <div className="relative aspect-[16/10] w-full">
            <Image src={collection.image} alt={collection.name} fill sizes="360px" className="object-cover" />
          </div>
          <div className="p-4">
            <h3 className="font-bold text-primary">{collection.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-gray-500">{collection.description}</p>
            <div className="mt-3 flex items-center gap-3">
              <Link
                href={`/admin/collections/${collection.id}`}
                className="flex items-center gap-1 text-sm text-accent hover:underline"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <button
                type="button"
                disabled={deletingId === collection.id}
                onClick={() => onDelete(collection.id, collection.name)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
