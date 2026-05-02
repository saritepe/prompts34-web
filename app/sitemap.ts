import { MetadataRoute } from 'next';
import { getPublicPrompts } from '@/lib/api/prompts';
import { TOPICS, getTopicPath } from '@/lib/topics';
import { TOOL_HUBS } from '@/lib/tool-hubs';
import { GLOSSARY, getGlossaryPath } from '@/lib/glossary';
import { GUIDES, getGuidePath } from '@/lib/guides';
import { PROFESSIONS, getProfessionPath } from '@/lib/professions';
import { USE_CASES, getUseCasePath } from '@/lib/use-cases';
import { getPromptPath } from '@/lib/utils/slug';

const BASE_URL = 'https://prompts34.com';

const NOW = new Date();

const STATIC_SITEMAP_ENTRIES: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    lastModified: NOW,
    changeFrequency: 'daily',
    priority: 1,
  },
  {
    url: `${BASE_URL}/araclar`,
    lastModified: NOW,
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  ...TOOL_HUBS.map((hub) => ({
    url: `${BASE_URL}${hub.canonicalPath}`,
    lastModified: NOW,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  })),
  {
    url: `${BASE_URL}/en-yeni-prompts`,
    lastModified: NOW,
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/one-cikanlar`,
    lastModified: NOW,
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/ucretsiz-promptlar`,
    lastModified: NOW,
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/prompts`,
    lastModified: NOW,
    changeFrequency: 'daily',
    priority: 0.8,
  },
];

export const dynamic = 'force-dynamic';

const TOPIC_SITEMAP_ENTRIES: MetadataRoute.Sitemap = [
  {
    url: `${BASE_URL}/kategori`,
    lastModified: NOW,
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  ...TOPICS.map((topic) => ({
    url: `${BASE_URL}${getTopicPath(topic)}`,
    lastModified: NOW,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })),
];

const SOZLUK_SITEMAP_ENTRIES: MetadataRoute.Sitemap = [
  {
    url: `${BASE_URL}/sozluk`,
    lastModified: NOW,
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  ...GLOSSARY.map((entry) => ({
    url: `${BASE_URL}${getGlossaryPath(entry)}`,
    lastModified: NOW,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  })),
];

const REHBER_SITEMAP_ENTRIES: MetadataRoute.Sitemap = [
  {
    url: `${BASE_URL}/rehber`,
    lastModified: NOW,
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  ...GUIDES.map((guide) => ({
    url: `${BASE_URL}${getGuidePath(guide)}`,
    lastModified: NOW,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  })),
];

const MESLEK_SITEMAP_ENTRIES: MetadataRoute.Sitemap = [
  {
    url: `${BASE_URL}/meslek`,
    lastModified: NOW,
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  ...PROFESSIONS.map((profession) => ({
    url: `${BASE_URL}${getProfessionPath(profession)}`,
    lastModified: NOW,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })),
];

const KULLANIM_SITEMAP_ENTRIES: MetadataRoute.Sitemap = [
  {
    url: `${BASE_URL}/kullanim`,
    lastModified: NOW,
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  ...USE_CASES.map((useCase) => ({
    url: `${BASE_URL}${getUseCasePath(useCase)}`,
    lastModified: NOW,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })),
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = [
    ...STATIC_SITEMAP_ENTRIES,
    ...TOPIC_SITEMAP_ENTRIES,
    ...MESLEK_SITEMAP_ENTRIES,
    ...KULLANIM_SITEMAP_ENTRIES,
    ...SOZLUK_SITEMAP_ENTRIES,
    ...REHBER_SITEMAP_ENTRIES,
  ];

  try {
    const prompts = await getPublicPrompts();
    const promptEntries: MetadataRoute.Sitemap = prompts.map((prompt) => ({
      url: `${BASE_URL}${getPromptPath(prompt)}`,
      lastModified: prompt.updated_at || prompt.created_at,
    }));

    return [...staticEntries, ...promptEntries];
  } catch (error) {
    console.error('Failed to fetch sitemap prompts.', error);
    return staticEntries;
  }
}
