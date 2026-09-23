import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  address: z.string().min(5, "Enter your street address"),
  city: z.string().min(2, "Enter your city"),
  state: z.string().min(2, "Enter your state/region"),
  country: z.string().min(2, "Enter your country"),
  shippingZone: z.enum(["lagos", "other-states", "international"]),
  paymentProvider: z.enum(["paystack", "stripe", "flutterwave"]),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
