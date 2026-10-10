import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { OrderStatusBadge } from "@/components/admin/orders/OrderStatusBadge";
import { getOrderByReference } from "@/lib/db";
import type { CartItem } from "@/types";

export const metadata: Metadata = { title: "Order Detail", robots: { index: false } };
export const dynamic = "force-dynamic";

interface OrderDetailPageProps {
  params: Promise<{ reference: string }>;
}

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const { reference } = await params;
  const order = getOrderByReference(reference);
  if (!order) notFound();

  const items = order.items as CartItem[];

  return (
    <AdminShell activePath="/admin/orders">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-2xl text-primary">{order.reference}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl bg-white p-6">
          <h2 className="font-bold text-primary">Items</h2>
          <ul className="mt-4 divide-y divide-gray-100">
            {items.map((item) => (
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
                <p className="text-sm font-semibold text-primary">
                  ₦{(item.priceNGN * item.quantity).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>₦{order.subtotalNGN.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping ({order.shippingZone})</span>
              <span>₦{order.shippingNGN.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-primary">
              <span>Total</span>
              <span>₦{order.totalNGN.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-6">
            <h2 className="font-bold text-primary">Customer</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Name</dt>
                <dd className="font-medium text-primary">{order.customer.fullName}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="font-medium text-primary">{order.customer.email}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Phone</dt>
                <dd className="font-medium text-primary">{order.customer.phone}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Shipping Address</dt>
                <dd className="font-medium text-primary">
                  {order.customer.address}, {order.customer.city}, {order.customer.state},{" "}
                  {order.customer.country}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl bg-white p-6">
            <h2 className="font-bold text-primary">Payment</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Provider</dt>
                <dd className="font-medium capitalize text-primary">{order.paymentProvider}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Currency</dt>
                <dd className="font-medium text-primary">{order.currency}</dd>
              </div>
              {order.paidAt && (
                <div>
                  <dt className="text-gray-500">Paid At</dt>
                  <dd className="font-medium text-primary">
                    {new Date(order.paidAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
