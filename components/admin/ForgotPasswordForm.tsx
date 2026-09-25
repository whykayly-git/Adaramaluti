"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function ForgotPasswordForm() {
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recoveryCode, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Could not reset password");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset password");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-light px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src={siteConfig.logo}
            alt="Adaramaluti House of Fashion logo"
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover"
          />
          <h1 className="mt-4 font-bold text-xl text-primary">Reset Admin Password</h1>
          <p className="mt-1 text-sm text-gray-500">
            Requires the recovery code set in your server environment.
          </p>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <CheckCircle2 className="h-10 w-10 text-accent" />
            <p className="text-sm text-gray-600">
              Your password has been reset. You can now sign in with your new password.
            </p>
            <Link
              href="/admin/login"
              className="mt-2 w-full rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="recoveryCode" className="mb-1 block text-sm font-medium text-gray-700">
                Recovery Code
              </label>
              <input
                id="recoveryCode"
                type="text"
                required
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="mb-1 block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
            >
              {submitting ? "Resetting..." : "Reset Password"}
            </button>

            <Link
              href="/admin/login"
              className="block text-center text-sm text-gray-500 hover:text-accent"
            >
              Back to Sign In
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
