import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-red-50 text-red-700",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        STYLES[status] ?? "bg-gray-100 text-gray-600"
      )}
    >
      {status}
    </span>
  );
}
