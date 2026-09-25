"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { Price } from "@/components/ui/Price";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const pathname = usePathname();
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotalNGN = useCartStore((s) => s.subtotalNGN());

  if (pathname.startsWith("/admin")) return null;

  return (
    <div
      className={`fixed inset-0 z-[70] transition ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-primary/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={close}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="font-bold text-lg text-primary">Your Cart ({items.length})</h2>
          <button type="button" onClick={close} aria-label="Close cart">
            <X className="h-5 w-5 text-gray-500 hover:text-primary" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-gray-500">Your cart is empty.</p>
              <Button href="/shop" size="sm" className="mt-4" onClick={close}>
                Shop Collection
              </Button>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-light">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/shop/${item.slug}`}
                          onClick={close}
                          className="text-sm font-semibold text-primary hover:text-accent"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-gray-500">
                          {item.color} / {item.size}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId, item.size, item.color)}
                        aria-label="Remove item"
                        className="text-gray-400 hover:text-primary"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() =>
                            updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <Price
                        amountNGN={item.priceNGN * item.quantity}
                        className="text-sm font-semibold text-primary"
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <Price amountNGN={subtotalNGN} className="font-semibold text-primary text-base" />
            </div>
            <Button href="/checkout" className="w-full" onClick={close}>
              Checkout
            </Button>
            <Button href="/cart" variant="outline" className="mt-2 w-full" onClick={close}>
              View Cart
            </Button>
          </div>
        )}
      </aside>
    </div>
  );
}
