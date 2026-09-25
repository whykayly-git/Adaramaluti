import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { CollectionForm } from "@/components/admin/collections/CollectionForm";
import { getCollectionById } from "@/lib/db";

export const metadata: Metadata = { title: "Edit Collection", robots: { index: false } };
export const dynamic = "force-dynamic";

interface EditCollectionPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCollectionPage({ params }: EditCollectionPageProps) {
  const { id } = await params;
  const collection = getCollectionById(Number(id));
  if (!collection) notFound();

  return (
    <AdminShell activePath="/admin/collections">
      <h1 className="font-bold text-3xl text-primary">Edit Collection</h1>
      <div className="mt-6">
        <CollectionForm collectionId={collection.id} initial={collection} />
      </div>
    </AdminShell>
  );
}
