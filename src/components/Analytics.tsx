'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let configured = false;

// gtag.js only processes real `arguments` objects pushed to dataLayer (not arrays),
// so this must be a classic function that pushes `arguments`.
function gtag() {
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

/**
 * Google Analytics 4. Rendered only when NEXT_PUBLIC_GA_ID is set.
 * Automatic page views are disabled; a page_view is sent on first load and on every
 * client-side navigation. Events queue in dataLayer until gtag.js (loaded lazily) runs.
 */
export function Analytics({ gaId }: { gaId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!configured) {
      configured = true;
      window.gtag = window.gtag || gtag;
      window.gtag('js', new Date());
      window.gtag('config', gaId, { send_page_view: false });
    }
    window.gtag?.('event', 'page_view', {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [gaId, pathname]);

  return (
    <Script
      id="ga4"
      src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
      strategy="lazyOnload"
    />
  );
}
