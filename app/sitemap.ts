import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/site-settings";
import { getAllProducts } from "@/data/products";
import { getAllCollections } from "@/data/collections";

export default function sitemap(): MetadataRoute.Sitemap {
  const settings = getSiteSettings();
  const staticRoutes = [
    "",
    "/shop",
    "/collections",
    "/lookbook",
    "/bespoke",
    "/about",
    "/contact",
    "/shipping-returns",
    "/privacy-policy",
    "/terms",
  ].map((path) => ({
    url: `${settings.url}${path}`,
    lastModified: new Date(),
  }));

  const productRoutes = getAllProducts().map((p) => ({
    url: `${settings.url}/shop/${p.slug}`,
    lastModified: new Date(p.createdAt),
  }));

  const collectionRoutes = getAllCollections().map((c) => ({
    url: `${settings.url}/collections/${c.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...productRoutes, ...collectionRoutes];
}
