import type { OrderDetails } from "@/types";

const STORAGE_KEY = "adaramaluti-pending-orders";

export function generateOrderReference(): string {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ADH-${Date.now().toString(36).toUpperCase()}-${random}`;
}

export function savePendingOrder(order: OrderDetails) {
  if (typeof window === "undefined") return;
  const all = getPendingOrders();
  all[order.reference] = order;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getPendingOrders(): Record<string, OrderDetails> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getPendingOrder(reference: string): OrderDetails | undefined {
  return getPendingOrders()[reference];
}
