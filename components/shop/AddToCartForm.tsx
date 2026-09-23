"use client";

import { useState } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { SizeGuideModal } from "@/components/shop/SizeGuideModal";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";

export function AddToCartForm({ product }: { product: Product }) {
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  function handleAddToCart() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      priceNGN: product.salePriceNGN ?? product.priceNGN,
      size,
      color,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-primary">
            Color: <span className="font-normal text-gray-600">{color}</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm",
                color === c
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 text-gray-700 hover:border-accent"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-primary">
            Size: <span className="font-normal text-gray-600">{size}</span>
          </span>
          <SizeGuideModal />
        </div>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm",
                size === s
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 text-gray-700 hover:border-accent"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-2 block text-sm font-semibold text-primary">Quantity</span>
        <div className="inline-flex items-center gap-3 rounded-full border border-gray-200 px-3 py-2">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-6 text-center">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          size="lg"
          className="flex-1"
          disabled={!product.inStock}
          onClick={handleAddToCart}
        >
          {!product.inStock ? "Sold Out" : added ? "Added to Cart ✓" : "Add to Cart"}
        </Button>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={isWishlisted}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gray-200 hover:border-accent"
        >
          <Heart className={cn("h-5 w-5", isWishlisted && "fill-accent text-accent")} />
        </button>
      </div>
    </div>
  );
}
