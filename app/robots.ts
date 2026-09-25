import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/site-settings";

export default function robots(): MetadataRoute.Robots {
  const settings = getSiteSettings();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/checkout", "/order-confirmation", "/cart", "/admin"],
    },
    sitemap: `${settings.url}/sitemap.xml`,
  };
}
