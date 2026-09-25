"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/shop/ProductCard";
import { useWishlistStore } from "@/store/wishlist-store";
import { useHydrated } from "@/lib/use-hydrated";
import type { Product } from "@/types";

export function WishlistClient({ products }: { products: Product[] }) {
  const productIds = useWishlistStore((s) => s.productIds);
  const hydrated = useHydrated();
  const items = products.filter((p) => productIds.includes(p.id));

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <SectionHeading eyebrow="Saved" title="Your Wishlist" />

        {!hydrated ? null : items.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-gray-500">You haven&rsquo;t saved anything yet.</p>
            <Button href="/shop" className="mt-6">
              Shop Collection
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
