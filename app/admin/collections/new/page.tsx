import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { CollectionForm } from "@/components/admin/collections/CollectionForm";

export const metadata: Metadata = { title: "Add Collection", robots: { index: false } };

export default function NewCollectionPage() {
  return (
    <AdminShell activePath="/admin/collections">
      <h1 className="font-bold text-3xl text-primary">Add Collection</h1>
      <div className="mt-6">
        <CollectionForm />
      </div>
    </AdminShell>
  );
}
