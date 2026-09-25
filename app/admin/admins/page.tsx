import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminsManager } from "@/components/admin/admins/AdminsManager";
import { listAdmins } from "@/lib/db";
import { getAdminSessionForPage } from "@/lib/require-admin";

export const metadata: Metadata = { title: "Manage Admins", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminAdminsPage() {
  const session = await getAdminSessionForPage();
  if (!session) redirect("/admin/login");

  const admins = listAdmins();

  return (
    <AdminShell activePath="/admin/admins">
      <h1 className="font-bold text-3xl text-primary">Admins</h1>
      <p className="mt-1 text-sm text-gray-500">{admins.length} accounts with dashboard access</p>
      <div className="mt-6">
        <AdminsManager admins={admins} currentEmail={session.email} />
      </div>
    </AdminShell>
  );
}
