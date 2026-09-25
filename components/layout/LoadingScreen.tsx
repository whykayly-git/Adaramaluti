"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useHydrated } from "@/lib/use-hydrated";
import type { SiteSettings } from "@/lib/site-settings";

export function LoadingScreen({ settings }: { settings: SiteSettings }) {
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
          src={settings.logo}
          alt={`${settings.name} logo`}
          width={80}
          height={80}
          className="h-20 w-20 rounded-full object-cover"
          priority
        />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
        {settings.shortName}
      </p>
    </div>
  );
}
