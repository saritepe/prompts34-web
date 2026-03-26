import { MetadataRoute } from 'next';
import { getPublicPrompts } from '@/lib/api/prompts';

const BASE_URL = 'https://prompts34.com';

const STATIC_SITEMAP_ENTRIES: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    changeFrequency: 'daily',
    priority: 1,
  },
  {
    url: `${BASE_URL}/cv-hazirlama`,
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/motivasyon-mektubu`,
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/mulakat-hazirligi`,
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/gorsel-olusturma`,
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/logo-olusturma`,
    changeFrequency: 'daily',
    priority: 0.9,
  },
];

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const prompts = await getPublicPrompts();
    const promptEntries: MetadataRoute.Sitemap = prompts.map((prompt) => ({
      url: `${BASE_URL}/prompts/${prompt.id}`,
      lastModified: prompt.updated_at || prompt.created_at,
    }));

    return [...STATIC_SITEMAP_ENTRIES, ...promptEntries];
  } catch (error) {
    console.error('Failed to fetch sitemap prompts.', error);
    return STATIC_SITEMAP_ENTRIES;
  }
}
