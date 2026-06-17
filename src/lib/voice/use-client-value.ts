"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Reads a value that only exists in the browser (feature detection, navigator,
 * location) without a hydration mismatch or a setState inside an effect. The
 * server snapshot renders first, then React swaps in the client value on mount.
 * `getClient` must return a stable primitive so the snapshot comparison settles.
 */
export function useClientValue<T>(getClient: () => T, serverValue: T): T {
  return useSyncExternalStore(subscribe, getClient, () => serverValue);
}
