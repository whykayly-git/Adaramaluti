import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { CollectionsTable } from "@/components/admin/collections/CollectionsTable";
import { listCollections } from "@/lib/db";

export const metadata: Metadata = { title: "Manage Collections", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function AdminCollectionsPage() {
  const collections = listCollections();

  return (
    <AdminShell activePath="/admin/collections">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl text-primary">Collections</h1>
          <p className="mt-1 text-sm text-gray-500">{collections.length} collections</p>
        </div>
        <Link
          href="/admin/collections/new"
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> Add Collection
        </Link>
      </div>

      <CollectionsTable collections={collections} />
    </AdminShell>
  );
}
