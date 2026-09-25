"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { SiteSettings } from "@/lib/site-settings";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [values, setValues] = useState<SiteSettings>(initial);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  function setAddress(key: keyof SiteSettings["address"], value: string) {
    setValues((v) => ({ ...v, address: { ...v.address, [key]: value } }));
    setSaved(false);
  }

  function setSocial(key: keyof SiteSettings["social"], value: string) {
    setValues((v) => ({ ...v, social: { ...v.social, [key]: value } }));
    setSaved(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Could not save settings");
      }
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save settings");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-2xl bg-white p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Brand Name">
          <input required value={values.name} onChange={(e) => set("name", e.target.value)} className="input" />
        </Field>
        <Field label="Short Name">
          <input
            required
            value={values.shortName}
            onChange={(e) => set("shortName", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Tagline">
          <input required value={values.tagline} onChange={(e) => set("tagline", e.target.value)} className="input" />
        </Field>
        <Field label="Logo path or URL">
          <input required value={values.logo} onChange={(e) => set("logo", e.target.value)} className="input" />
        </Field>
        <Field label="Email">
          <input
            required
            type="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Phone">
          <input required value={values.phone} onChange={(e) => set("phone", e.target.value)} className="input" />
        </Field>
        <Field label="WhatsApp number (digits, with country code)">
          <input
            required
            value={values.whatsapp}
            onChange={(e) => set("whatsapp", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Site URL">
          <input required type="url" value={values.url} onChange={(e) => set("url", e.target.value)} className="input" />
        </Field>
      </div>

      <Field label="Brand Description">
        <textarea
          required
          rows={3}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          className="input resize-none"
        />
      </Field>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-primary">Atelier Address</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Address Line 1">
            <input value={values.address.line1} onChange={(e) => setAddress("line1", e.target.value)} className="input" />
          </Field>
          <Field label="Address Line 2">
            <input value={values.address.line2} onChange={(e) => setAddress("line2", e.target.value)} className="input" />
          </Field>
          <Field label="City / State">
            <input value={values.address.city} onChange={(e) => setAddress("city", e.target.value)} className="input" />
          </Field>
          <Field label="Country">
            <input value={values.address.country} onChange={(e) => setAddress("country", e.target.value)} className="input" />
          </Field>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-primary">Social Links</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Instagram">
            <input value={values.social.instagram} onChange={(e) => setSocial("instagram", e.target.value)} className="input" />
          </Field>
          <Field label="Facebook">
            <input value={values.social.facebook} onChange={(e) => setSocial("facebook", e.target.value)} className="input" />
          </Field>
          <Field label="Twitter / X">
            <input value={values.social.twitter} onChange={(e) => setSocial("twitter", e.target.value)} className="input" />
          </Field>
          <Field label="TikTok">
            <input value={values.social.tiktok} onChange={(e) => setSocial("tiktok", e.target.value)} className="input" />
          </Field>
          <Field label="Pinterest">
            <input value={values.social.pinterest} onChange={(e) => setSocial("pinterest", e.target.value)} className="input" />
          </Field>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Brand Settings"}
        </Button>
        {saved && <span className="text-sm text-accent">Saved</span>}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}
