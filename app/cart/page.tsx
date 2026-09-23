"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotalNGN = useCartStore((s) => s.subtotalNGN());

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <SectionHeading eyebrow="Your Bag" title="Shopping Cart" />

        {items.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-gray-500">Your cart is currently empty.</p>
            <Button href="/shop" className="mt-6">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
            <ul className="divide-y divide-gray-100">
              {items.map((item) => (
                <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-5 py-6">
                  <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-light">
                    <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/shop/${item.slug}`}
                          className="font-semibold text-primary hover:text-accent"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-sm text-gray-500">
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 rounded-full border border-gray-200 px-3 py-1.5">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() =>
                            updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <Price
                        amountNGN={item.priceNGN * item.quantity}
                        className="font-semibold text-primary"
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="h-fit rounded-2xl bg-light p-6">
              <h2 className="font-bold text-lg text-primary">Order Summary</h2>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <Price amountNGN={subtotalNGN} className="font-semibold text-primary" />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Shipping and taxes calculated at checkout.
              </p>
              <Button href="/checkout" className="mt-6 w-full">
                Proceed to Checkout
              </Button>
              <Button href="/shop" variant="ghost" className="mt-2 w-full">
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
