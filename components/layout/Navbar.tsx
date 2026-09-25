"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { CurrencySwitcher } from "@/components/layout/CurrencySwitcher";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { navLinks } from "@/lib/site-config";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.open);
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const hydrated = useHydrated();

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
        <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
          <Logo size={40} withWordmark className="sm:[&_span:first-child]:h-12 sm:[&_span:first-child]:w-12" />

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium text-gray-700 transition-colors hover:text-accent",
                  pathname === link.href && "text-accent"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="rounded-full p-2 text-gray-600 hover:bg-light hover:text-accent"
            >
              <Search className="h-5 w-5" />
            </button>

            <CurrencySwitcher className="hidden sm:block" />

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative rounded-full p-2 text-gray-600 hover:bg-light hover:text-accent"
            >
              <Heart className="h-5 w-5" />
              {hydrated && wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-label="Open cart"
              className="relative rounded-full p-2 text-gray-600 hover:bg-light hover:text-accent"
            >
              <ShoppingBag className="h-5 w-5" />
              {hydrated && totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="rounded-full p-2 text-gray-600 hover:bg-light hover:text-accent lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </Container>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <div
        className={cn(
          "fixed inset-0 z-[80] lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-primary/40 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            "absolute right-0 top-0 h-full w-72 max-w-[85%] bg-white shadow-2xl transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <Logo size={36} href={null} />
            <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-3 py-4" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-light hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-gray-100 px-5 py-4">
            <CurrencySwitcher />
          </div>
        </div>
      </div>
    </>
  );
}
