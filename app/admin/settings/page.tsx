import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";
import { PageContentEditor } from "@/components/admin/settings/PageContentEditor";
import { getSiteSettings } from "@/lib/site-settings";
import { getAllPageContent } from "@/lib/page-content";

export const metadata: Metadata = { title: "Site Settings", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  const settings = getSiteSettings();
  const pageContent = getAllPageContent();

  return (
    <AdminShell activePath="/admin/settings">
      <h1 className="font-bold text-3xl text-primary">Site Settings</h1>
      <p className="mt-1 text-sm text-gray-500">
        Brand details shown across the site, plus the Shipping & Returns, Privacy Policy, Terms
        of Service and Contact page content.
      </p>

      <div className="mt-6">
        <SettingsForm initial={settings} />
      </div>

      <h2 className="mt-10 font-bold text-xl text-primary">Legal & Contact Pages</h2>
      <div className="mt-4">
        <PageContentEditor initial={pageContent} />
      </div>
    </AdminShell>
  );
}
