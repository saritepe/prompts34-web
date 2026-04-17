import { MetadataRoute } from 'next';
import { getPublicPrompts } from '@/lib/api/prompts';
import { TOPIC_PAGES } from './konular/topic-pages';

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
  {
    url: `${BASE_URL}/chatgpt-promptlari`,
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/gemini-promptlari`,
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/en-yeni-prompts`,
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/one-cikanlar`,
    changeFrequency: 'daily',
    priority: 0.9,
  },
];

export const dynamic = 'force-dynamic';

const TOPIC_SITEMAP_ENTRIES: MetadataRoute.Sitemap = [
  {
    url: `${BASE_URL}/konular`,
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  ...TOPIC_PAGES.map((topic) => ({
    url: `${BASE_URL}${topic.canonicalPath}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })),
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = [...STATIC_SITEMAP_ENTRIES, ...TOPIC_SITEMAP_ENTRIES];

  try {
    const prompts = await getPublicPrompts();
    const promptEntries: MetadataRoute.Sitemap = prompts.map((prompt) => ({
      url: `${BASE_URL}/prompts/${prompt.id}`,
      lastModified: prompt.updated_at || prompt.created_at,
    }));

    return [...staticEntries, ...promptEntries];
  } catch (error) {
    console.error('Failed to fetch sitemap prompts.', error);
    return staticEntries;
  }
}
