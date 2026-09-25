import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { SubmissionCard } from "@/components/admin/SubmissionCard";
import { getAllSubmissions } from "@/lib/db";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  const submissions = getAllSubmissions();
  const bespoke = submissions.filter((s) => s.type === "bespoke");
  const contact = submissions.filter((s) => s.type === "contact");

  return (
    <AdminShell activePath="/admin">
      <h1 className="font-bold text-3xl text-primary">Submissions</h1>
      <p className="mt-1 text-sm text-gray-500">
        Bespoke requests and contact messages sent through the website.
      </p>

      <section className="mt-8">
        <h2 className="font-bold text-lg text-primary">
          Bespoke Requests <span className="text-gray-400">({bespoke.length})</span>
        </h2>
        {bespoke.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">No bespoke requests yet.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 rounded-2xl bg-white p-4 sm:grid-cols-2">
            {bespoke.map((s) => (
              <SubmissionCard key={s.id} submission={s} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-bold text-lg text-primary">
          Contact Messages <span className="text-gray-400">({contact.length})</span>
        </h2>
        {contact.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">No contact messages yet.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 rounded-2xl bg-white p-4 sm:grid-cols-2">
            {contact.map((s) => (
              <SubmissionCard key={s.id} submission={s} />
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}
