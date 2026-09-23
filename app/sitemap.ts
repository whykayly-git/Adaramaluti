import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { products } from "@/data/products";
import { collections } from "@/data/collections";

export default function sitemap(): MetadataRoute.Sitemap {
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
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((p) => ({
    url: `${siteConfig.url}/shop/${p.slug}`,
    lastModified: new Date(p.createdAt),
  }));

  const collectionRoutes = collections.map((c) => ({
    url: `${siteConfig.url}/collections/${c.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...productRoutes, ...collectionRoutes];
}
