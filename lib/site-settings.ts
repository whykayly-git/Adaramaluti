import { getSetting, setSetting } from "@/lib/db";
import { siteConfig as defaultSiteConfig } from "@/lib/site-config";

/**
 * Node-only (imports lib/db.ts, which uses node:sqlite) — only call this
 * from server components, route handlers, or other server-only code. Client
 * components that need these values should receive them as props from a
 * server component instead (see app/layout.tsx).
 */

const SETTINGS_KEY = "site_settings";

export interface SiteSettings {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  logo: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: { line1: string; line2: string; city: string; country: string };
  social: { instagram: string; facebook: string; twitter: string; tiktok: string; pinterest: string };
}

function defaults(): SiteSettings {
  return {
    name: defaultSiteConfig.name,
    shortName: defaultSiteConfig.shortName,
    tagline: defaultSiteConfig.tagline,
    description: defaultSiteConfig.description,
    url: defaultSiteConfig.url,
    logo: defaultSiteConfig.logo,
    email: defaultSiteConfig.email,
    phone: defaultSiteConfig.phone,
    whatsapp: defaultSiteConfig.whatsapp,
    address: { ...defaultSiteConfig.address },
    social: { ...defaultSiteConfig.social },
  };
}

export function getSiteSettings(): SiteSettings {
  const stored = getSetting(SETTINGS_KEY);
  if (!stored) return defaults();

  const overrides = JSON.parse(stored) as Partial<SiteSettings>;
  const base = defaults();
  return {
    ...base,
    ...overrides,
    address: { ...base.address, ...overrides.address },
    social: { ...base.social, ...overrides.social },
  };
}

export function updateSiteSettings(settings: SiteSettings): void {
  setSetting(SETTINGS_KEY, JSON.stringify(settings));
}
