export type Currency = "NGN" | "USD" | "GBP" | "EUR";

export type ProductCategory = "Dresses" | "Suits" | "Native Wear" | "Accessories";

export interface Product {
  id: string;
  slug: string;
  name: string;
  priceNGN: number;
  salePriceNGN?: number;
  category: ProductCategory;
  collection: string;
  sizes: string[];
  colors: string[];
  images: string[];
  description: string;
  inStock: boolean;
  featured: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  priceNGN: number;
  size: string;
  color: string;
  quantity: number;
}

export interface Collection {
  slug: string;
  name: string;
  description: string;
  image: string;
}

export type ShippingZone = "lagos" | "other-states" | "international";

export interface ShippingOption {
  id: ShippingZone;
  label: string;
  description: string;
  rateNGN: number;
  etaDays: string;
}

export type PaymentProvider = "paystack" | "stripe" | "flutterwave";

export interface OrderDetails {
  reference: string;
  items: CartItem[];
  subtotalNGN: number;
  shippingNGN: number;
  totalNGN: number;
  currency: Currency;
  shippingZone: ShippingZone;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
  };
  paymentProvider: PaymentProvider;
  paidAt: string;
}
