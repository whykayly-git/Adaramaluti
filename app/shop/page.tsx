import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { SortSelect } from "@/components/shop/SortSelect";
import { Pagination } from "@/components/shop/Pagination";
import { products } from "@/data/products";
import type { Product } from "@/types";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop dresses, suits, native wear and accessories from Adaramaluti House of Fashion.",
};

const PAGE_SIZE = 8;

function effectivePrice(p: Product) {
  return p.salePriceNGN ?? p.priceNGN;
}

function filterAndSort(searchParams: Record<string, string | undefined>): Product[] {
  let list = [...products];

  const { category, size, color, price, q, sort } = searchParams;

  if (category) list = list.filter((p) => p.category === category);
  if (size) list = list.filter((p) => p.sizes.includes(size));
  if (color) list = list.filter((p) => p.colors.includes(color));
  if (q) {
    const query = q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.collection.toLowerCase().includes(query)
    );
  }
  if (price) {
    const [minStr, maxStr] = price.split("-");
    const min = minStr ? Number(minStr) : undefined;
    const max = maxStr ? Number(maxStr) : undefined;
    list = list.filter((p) => {
      const value = effectivePrice(p);
      if (min !== undefined && value < min) return false;
      if (max !== undefined && value > max) return false;
      return true;
    });
  }

  switch (sort) {
    case "price-asc":
      list.sort((a, b) => effectivePrice(a) - effectivePrice(b));
      break;
    case "price-desc":
      list.sort((a, b) => effectivePrice(b) - effectivePrice(a));
      break;
    case "name-asc":
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return list;
}

interface ShopPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const rawParams = await searchParams;
  const params: Record<string, string | undefined> = {};
  for (const key of Object.keys(rawParams)) {
    const value = rawParams[key];
    params[key] = Array.isArray(value) ? value[0] : value;
  }

  const filtered = filterAndSort(params);
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function buildHref(targetPage: number) {
    const search = new URLSearchParams(
      Object.entries(params).filter(([, v]) => Boolean(v)) as [string, string][]
    );
    search.set("page", String(targetPage));
    return `/shop?${search.toString()}`;
  }

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="Shop"
          title={params.q ? `Results for "${params.q}"` : "Shop All"}
          description="Considered pieces for every occasion, made with intention."
        />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
          <Suspense>
            <ShopFilters />
          </Suspense>

          <div>
            <div className="hidden items-center justify-between lg:flex">
              <p className="text-sm text-gray-500">{filtered.length} products</p>
              <Suspense>
                <SortSelect />
              </Suspense>
            </div>

            {paged.length === 0 ? (
              <p className="mt-10 text-center text-gray-500">
                No products match your filters. Try clearing some filters.
              </p>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3">
                {paged.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} buildHref={buildHref} />
          </div>
        </div>
      </Container>
    </div>
  );
}
