"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { useHydrated } from "@/lib/use-hydrated";

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const hydrated = useHydrated();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 900);
    return () => clearTimeout(timer);
  }, []);

  if (!hydrated || !visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-white transition-opacity duration-500"
      role="status"
      aria-label="Loading"
    >
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5 animate-fade-pulse">
        <Image
          src={siteConfig.logo}
          alt="Adaramaluti House of Fashion logo"
          width={80}
          height={80}
          className="h-20 w-20 rounded-full object-cover"
          priority
        />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
        {siteConfig.shortName}
      </p>
    </div>
  );
}
