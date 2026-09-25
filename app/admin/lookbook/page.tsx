import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { LookbookManager } from "@/components/admin/lookbook/LookbookManager";
import { getAllLookbookImages } from "@/data/lookbook";

export const metadata: Metadata = { title: "Manage Lookbook", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function AdminLookbookPage() {
  const images = getAllLookbookImages();

  return (
    <AdminShell activePath="/admin/lookbook">
      <h1 className="font-bold text-3xl text-primary">Lookbook</h1>
      <p className="mt-1 text-sm text-gray-500">{images.length} images</p>
      <div className="mt-6">
        <LookbookManager images={images} />
      </div>
    </AdminShell>
  );
}
