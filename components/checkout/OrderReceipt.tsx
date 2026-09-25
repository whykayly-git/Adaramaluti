import Image from "next/image";
import { Price } from "@/components/ui/Price";
import { siteConfig } from "@/lib/site-config";
import type { OrderDetails, ShippingOption } from "@/types";

export function OrderReceipt({
  order,
  shippingOptions,
}: {
  order: OrderDetails;
  shippingOptions: ShippingOption[];
}) {
  const shipping =
    shippingOptions.find((o) => o.id === order.shippingZone) ?? shippingOptions[0];

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-8 shadow-sm print:shadow-none">
      <div className="flex flex-col items-center border-b border-gray-100 pb-6 text-center">
        <Image
          src={siteConfig.logo}
          alt="Adaramaluti House of Fashion logo"
          width={72}
          height={72}
          className="h-18 w-18 rounded-full object-cover"
        />
        <h1 className="mt-3 font-bold text-xl text-primary">{siteConfig.name}</h1>
        <p className="text-xs text-gray-500">{siteConfig.tagline}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 border-b border-gray-100 py-6 text-sm">
        <div>
          <p className="text-gray-500">Order Reference</p>
          <p className="font-semibold text-primary">{order.reference}</p>
        </div>
        <div>
          <p className="text-gray-500">Date</p>
          <p className="font-semibold text-primary">
            {new Date(order.paidAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Billed To</p>
          <p className="font-semibold text-primary">{order.customer.fullName}</p>
          <p className="text-gray-500">{order.customer.email}</p>
        </div>
        <div>
          <p className="text-gray-500">Ship To</p>
          <p className="font-semibold text-primary">
            {order.customer.address}, {order.customer.city}, {order.customer.state}
          </p>
          <p className="text-gray-500">{order.customer.country}</p>
        </div>
      </div>

      <ul className="divide-y divide-gray-100 py-2">
        {order.items.map((item) => (
          <li key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-4 py-3">
            <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-light">
              <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
            </div>
            <div className="flex-1 text-sm">
              <p className="font-medium text-primary">{item.name}</p>
              <p className="text-xs text-gray-500">
                {item.color} / {item.size} × {item.quantity}
              </p>
            </div>
            <Price amountNGN={item.priceNGN * item.quantity} className="text-sm font-semibold" />
          </li>
        ))}
      </ul>

      <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <Price amountNGN={order.subtotalNGN} />
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping ({shipping.label})</span>
          <Price amountNGN={order.shippingNGN} />
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-primary">
          <span>Total Paid</span>
          <Price amountNGN={order.totalNGN} />
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-gray-500">
        Paid via {order.paymentProvider} · Questions? Contact {siteConfig.email}
      </p>
    </div>
  );
}
