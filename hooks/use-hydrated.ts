"use client";

import { useEffect, useState } from "react";

/**
 * True only after the first client render. Guards localStorage-backed
 * state (the persisted cart) against server/client hydration mismatch.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
