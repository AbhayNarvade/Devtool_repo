import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/config/site';
import { indexablePages } from '@/data';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return indexablePages().map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: page.lastModified,
  }));
}
