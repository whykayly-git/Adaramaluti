import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { getProductById } from "@/lib/db";
import { getAllCollections } from "@/data/collections";

export const metadata: Metadata = { title: "Edit Product", robots: { index: false } };
export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const collectionNames = getAllCollections().map((c) => c.name);

  return (
    <AdminShell activePath="/admin/products">
      <h1 className="font-bold text-3xl text-primary">Edit Product</h1>
      <div className="mt-6">
        <ProductForm productId={product.id} initial={product} collectionNames={collectionNames} />
      </div>
    </AdminShell>
  );
}
