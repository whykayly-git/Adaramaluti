import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/checkout", "/order-confirmation", "/cart"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
