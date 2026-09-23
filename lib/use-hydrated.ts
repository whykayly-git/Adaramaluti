"use client";

import { useEffect, useState } from "react";

/** True only after the client has mounted, to avoid SSR/localStorage hydration mismatches. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard SSR-hydration guard
    setHydrated(true);
  }, []);
  return hydrated;
}
