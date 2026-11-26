'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { AD_PLACEMENTS, type AdFormat, type AdPlacementKey } from '@/config/ads';
import { ADSENSE_CLIENT } from '@/config/site';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSlotProps {
  /** AdSense data-ad-slot ID. */
  slot: string;
  format?: AdFormat;
  /** Reserved height in px so the ad never shifts layout. */
  minHeight?: number;
  desktopOnly?: boolean;
  /** Spacing around the ad. Defaults to generous vertical margins that keep ads away from controls. */
  className?: string;
}

function AdUnit({
  slot,
  format,
  minHeight,
}: {
  slot: string;
  format: AdFormat;
  minHeight: number;
}) {
  const pushed = useRef(false);
  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not ready or blocked by an extension; the reserved space simply stays empty.
    }
  }, []);
  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', minHeight }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}

/** Same breakpoint as Tailwind's `xl`, where the tool-page sidebar is shown. */
const DESKTOP_QUERY = '(min-width: 1280px)';

function subscribeDesktop(callback: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

/** True on wide screens; false during server rendering and on phones and tablets. */
function useIsDesktop(): boolean {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}

/**
 * Renders a single AdSense unit with reserved space and an "Advertisement" label.
 * Renders nothing when NEXT_PUBLIC_ADSENSE_CLIENT or the slot ID is empty.
 * Keyed by pathname so each client-side navigation gets a fresh <ins> element.
 */
export function AdSlot({
  slot,
  format = 'auto',
  minHeight = 280,
  desktopOnly = false,
  className = 'my-10',
}: AdSlotProps) {
  const pathname = usePathname();
  const isDesktop = useIsDesktop();
  if (!ADSENSE_CLIENT || !slot) return null;
  // Never create a desktop-only unit on smaller screens: AdSense reports an error for
  // hidden (zero-width) units, and an unseen ad should not be requested at all.
  if (desktopOnly && !isDesktop) return null;
  return (
    <aside aria-label="Advertisement" className={`block ${className}`}>
      <p className="mb-1 text-center text-xs tracking-wide text-fg-muted uppercase">
        Advertisement
      </p>
      <div style={{ minHeight }} className="overflow-hidden rounded-lg bg-bg-subtle">
        <AdUnit key={pathname} slot={slot} format={format} minHeight={minHeight} />
      </div>
    </aside>
  );
}

/** Ad placement read from src/config/ads.ts. */
export function AdPlacement({ name, className }: { name: AdPlacementKey; className?: string }) {
  const p = AD_PLACEMENTS[name];
  if (!p.enabled) return null;
  return (
    <AdSlot
      slot={p.slot}
      format={p.format}
      minHeight={p.minHeight}
      desktopOnly={'desktopOnly' in p ? p.desktopOnly : false}
      className={className}
    />
  );
}
