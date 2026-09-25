import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductsTable } from "@/components/admin/products/ProductsTable";
import { getAllProducts } from "@/data/products";

export const metadata: Metadata = { title: "Manage Shop", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function AdminProductsPage() {
  const products = getAllProducts();

  return (
    <AdminShell activePath="/admin/products">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl text-primary">Shop</h1>
          <p className="mt-1 text-sm text-gray-500">{products.length} products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      <ProductsTable products={products} />
    </AdminShell>
  );
}
