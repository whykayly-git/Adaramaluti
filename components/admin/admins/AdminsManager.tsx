"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AdminRow {
  id: number;
  email: string;
  createdAt: string;
}

export function AdminsManager({ admins, currentEmail }: { admins: AdminRow[]; currentEmail: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Could not add admin");
      }
      setEmail("");
      setPassword("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add admin");
    } finally {
      setSubmitting(false);
    }
  }

  async function onRemove(id: number) {
    if (!window.confirm("Remove this admin's access?")) return;
    setRemovingId(id);
    try {
      const res = await fetch(`/api/admin/admins/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        window.alert(data.error ?? "Could not remove admin");
        return;
      }
      router.refresh();
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div>
      <form onSubmit={onAdd} className="rounded-2xl bg-white p-6">
        <h2 className="font-bold text-lg text-primary">Add Admin</h2>
        <p className="mt-1 text-sm text-gray-500">
          There&rsquo;s no email service configured, so this creates the account directly — share the
          password with them yourself.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input
              required
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={submitting} className="mt-4">
          {submitting ? "Adding..." : "Add Admin"}
        </Button>
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Added</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-b border-gray-50">
                <td className="px-4 py-3 font-medium text-primary">
                  {admin.email}
                  {admin.email.toLowerCase() === currentEmail.toLowerCase() && (
                    <span className="ml-2 rounded-full bg-light px-2 py-0.5 text-xs text-accent">
                      You
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(admin.createdAt).toLocaleDateString("en-US", {
                    dateStyle: "medium",
                  })}
                </td>
                <td className="px-4 py-3 text-right">
                  {admin.email.toLowerCase() !== currentEmail.toLowerCase() && (
                    <button
                      type="button"
                      disabled={removingId === admin.id}
                      onClick={() => onRemove(admin.id)}
                      aria-label={`Remove ${admin.email}`}
                      className="text-gray-500 hover:text-red-600 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
