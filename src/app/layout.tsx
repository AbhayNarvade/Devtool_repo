import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from '@/components/Analytics';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { JsonLd } from '@/components/JsonLd';
import { ToastProvider } from '@/components/ui/Toast';
import {
  ADSENSE_CLIENT,
  GA_ID,
  LANG,
  OG_LOCALE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  THEME_COLOR_DARK,
  THEME_COLOR_LIGHT,
} from '@/config/site';
import { graph, organizationLd, websiteLd } from '@/lib/jsonld';
import { ROBOTS_INDEX } from '@/lib/seo';
import { THEME_INIT_SCRIPT } from '@/lib/theme';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  robots: ROBOTS_INDEX,
  openGraph: { siteName: SITE_NAME, locale: OG_LOCALE, type: 'website' },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: THEME_COLOR_LIGHT },
    { media: '(prefers-color-scheme: dark)', color: THEME_COLOR_DARK },
  ],
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang={LANG} data-theme="light" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Applies the saved or system theme before first paint (no flash). */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <a
          href="#main"
          className="sr-only z-50 rounded-lg bg-accent px-4 py-2 text-accent-fg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <JsonLd data={graph(organizationLd(), websiteLd())} />
        <ToastProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </ToastProvider>
        {ADSENSE_CLIENT ? (
          <Script
            id="adsense"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADSENSE_CLIENT)}`}
          />
        ) : null}
        {GA_ID ? <Analytics gaId={GA_ID} /> : null}
      </body>
    </html>
  );
}
