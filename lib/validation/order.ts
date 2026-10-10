import { z } from "zod";

const cartItemSchema = z.object({
  productId: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  image: z.string().min(1),
  priceNGN: z.number().nonnegative(),
  size: z.string().min(1),
  color: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  reference: z.string().min(1),
  items: z.array(cartItemSchema).min(1),
  subtotalNGN: z.number().nonnegative(),
  shippingNGN: z.number().nonnegative(),
  totalNGN: z.number().positive(),
  currency: z.enum(["NGN", "USD", "GBP", "EUR"]),
  shippingZone: z.enum(["lagos", "other-states", "international"]),
  customer: z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1),
  }),
  paymentProvider: z.enum(["paystack", "stripe", "flutterwave"]),
});
