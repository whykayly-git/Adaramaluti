import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { getAllCollections } from "@/data/collections";

export const metadata: Metadata = { title: "Add Product", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function NewProductPage() {
  const collectionNames = getAllCollections().map((c) => c.name);

  return (
    <AdminShell activePath="/admin/products">
      <h1 className="font-bold text-3xl text-primary">Add Product</h1>
      <div className="mt-6">
        <ProductForm collectionNames={collectionNames} />
      </div>
    </AdminShell>
  );
}
