"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/types";
import { Price } from "@/components/ui/Price";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const isWishlisted = useWishlistStore((s) => s.has(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  const onSale = typeof product.salePriceNGN === "number";

  return (
    <div className="group relative">
      <Link
        href={`/shop/${product.slug}`}
        className="block overflow-hidden rounded-2xl bg-light"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
          {onSale && (
            <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
              Sale
            </span>
          )}
          {!product.inStock && (
            <span className="absolute left-3 top-3 rounded-full bg-gray-700 px-3 py-1 text-xs font-semibold text-white">
              Sold Out
            </span>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        aria-pressed={isWishlisted}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm transition-transform hover:scale-105"
      >
        <Heart className={cn("h-4 w-4", isWishlisted && "fill-accent text-accent")} />
      </button>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <Link href={`/shop/${product.slug}`} className="font-semibold text-primary hover:text-accent">
            {product.name}
          </Link>
          <p className="text-sm text-gray-500">{product.category}</p>
        </div>
        <div className="text-right">
          {onSale ? (
            <div className="flex flex-col items-end">
              <Price amountNGN={product.salePriceNGN as number} className="font-semibold text-primary" />
              <Price amountNGN={product.priceNGN} className="text-xs text-gray-400 line-through" />
            </div>
          ) : (
            <Price amountNGN={product.priceNGN} className="font-semibold text-primary" />
          )}
        </div>
      </div>
    </div>
  );
}
