'use client';

import { useSyncExternalStore } from 'react';

// One shared 1-second clock for all components that need the current time.
let current = 0;
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    current = Date.now();
    timer = setInterval(() => {
      current = Date.now();
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

function getSnapshot() {
  if (!current) current = Date.now();
  return current;
}

/**
 * Current time in ms, updated every second. Returns null during server rendering and
 * hydration, so time-dependent output never causes a hydration mismatch.
 */
export function useNow(): number | null {
  const now = useSyncExternalStore(subscribe, getSnapshot, () => 0);
  return now || null;
}
