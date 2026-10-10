import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { OrderStatusBadge } from "@/components/admin/orders/OrderStatusBadge";
import { listOrders } from "@/lib/db";

export const metadata: Metadata = { title: "Orders", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function AdminOrdersPage() {
  const orders = listOrders();
  const paidTotal = orders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.totalNGN, 0);

  return (
    <AdminShell activePath="/admin/orders">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-bold text-3xl text-primary">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">{orders.length} orders</p>
        </div>
        <div className="rounded-2xl bg-light px-5 py-3 text-right">
          <p className="text-xs uppercase tracking-wide text-gray-500">Paid Revenue</p>
          <p className="font-bold text-xl text-primary">₦{paidTotal.toLocaleString()}</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">No orders yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500">
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.reference} className="border-b border-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.reference}`}
                      className="font-medium text-accent hover:underline"
                    >
                      {order.reference}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {order.customer.fullName}
                    <p className="text-xs text-gray-400">{order.customer.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700">₦{order.totalNGN.toLocaleString()}</td>
                  <td className="px-4 py-3 capitalize text-gray-700">{order.paymentProvider}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
