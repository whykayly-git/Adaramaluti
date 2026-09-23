import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  Paystack: "bg-[#00C3F7] text-white",
  Stripe: "bg-[#635BFF] text-white",
  Flutterwave: "bg-[#F5A623] text-white",
  Visa: "bg-[#1A1F71] text-white",
  Mastercard: "bg-gray-800 text-white",
  Verve: "bg-emerald-700 text-white",
  "Apple Pay": "bg-black text-white",
  "Google Pay": "bg-white text-gray-700 border border-gray-200",
};

export function PaymentBadge({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold",
        styles[name] ?? "bg-gray-100 text-gray-700",
        className
      )}
    >
      {name}
    </span>
  );
}
