import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import RootLayout, { metadata } from '@/app/layout';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { SOCIAL_IMAGE_PATH } from '@/app/shared-metadata';
import { getPublicPrompts } from '@/lib/api/prompts';
import { TOPICS, getTopicPath } from '@/lib/topics';
import { TOOL_HUBS } from '@/lib/tool-hubs';
import { GLOSSARY, getGlossaryPath } from '@/lib/glossary';
import { GUIDES, getGuidePath } from '@/lib/guides';
import { PROFESSIONS, getProfessionPath } from '@/lib/professions';
import { USE_CASES, getUseCasePath } from '@/lib/use-cases';
import { getPromptPath } from '@/lib/utils/slug';
import { buildPrompt } from './test-utils/fixtures';

vi.mock('@/lib/api/prompts', () => ({
  getPublicPrompts: vi.fn(),
}));

describe('layout and metadata routes', () => {
  const getPublicPromptsMock = vi.mocked(getPublicPrompts);

  beforeEach(() => {
    getPublicPromptsMock.mockReset();
    getPublicPromptsMock.mockResolvedValue([]);
  });

  it('renders the root layout shell, structured data, footer, and analytics', () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <div>Child Content</div>
      </RootLayout>,
    );

    expect(markup).toContain('<html lang="tr">');
    expect(markup).toContain('font-geist-sans');
    expect(markup).toContain('Child Content');
    expect(markup).toContain('Topluluğa Katıl');
    expect(markup).toContain('"@type":"WebSite"');
    expect(markup).toContain('data-testid="analytics"');
  });

  it('exports the expected site metadata', () => {
    expect(metadata.metadataBase?.toString()).toBe('https://prompts34.com/');
    expect(metadata.title).toEqual({
      default:
        'Prompts34 | Hazır Promptlar - Türkçe Yapay Zeka Prompt Kütüphanesi',
      template: '%s | Prompts34',
    });
    expect(metadata.alternates?.canonical).toBe('https://prompts34.com');
    expect(metadata.robots).toEqual({
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    });
    expect(metadata.openGraph?.images).toEqual([
      {
        url: SOCIAL_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: 'Prompts34 - Yapay Zeka Promptları',
      },
    ]);
    expect(metadata.twitter?.images).toEqual([SOCIAL_IMAGE_PATH]);
  });

  it('returns the expected robots rules', () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/my-prompts', '/auth/', '/giris', '/kayit'],
      },
      sitemap: 'https://prompts34.com/sitemap.xml',
    });
  });

  it('returns the expected sitemap entries', async () => {
    const promptUpdated = buildPrompt({
      id: 'prompt-updated',
      created_at: '2026-03-20T10:00:00.000Z',
      updated_at: '2026-03-25T10:00:00.000Z',
    });
    const promptCreated = buildPrompt({
      id: 'prompt-created',
      created_at: '2026-03-21T10:00:00.000Z',
      updated_at: '',
    });
    getPublicPromptsMock.mockResolvedValueOnce([promptUpdated, promptCreated]);

    const entries = await sitemap();

    const expectedStaticUrls = [
      'https://prompts34.com',
      'https://prompts34.com/araclar',
      ...TOOL_HUBS.map((hub) => `https://prompts34.com${hub.canonicalPath}`),
      'https://prompts34.com/en-yeni-prompts',
      'https://prompts34.com/one-cikanlar',
      'https://prompts34.com/ucretsiz-promptlar',
      'https://prompts34.com/prompts',
      'https://prompts34.com/kategori',
      ...TOPICS.map((topic) => `https://prompts34.com${getTopicPath(topic)}`),
      'https://prompts34.com/meslek',
      ...PROFESSIONS.map(
        (profession) => `https://prompts34.com${getProfessionPath(profession)}`,
      ),
      'https://prompts34.com/kullanim',
      ...USE_CASES.map(
        (useCase) => `https://prompts34.com${getUseCasePath(useCase)}`,
      ),
      'https://prompts34.com/sozluk',
      ...GLOSSARY.map(
        (entry) => `https://prompts34.com${getGlossaryPath(entry)}`,
      ),
      'https://prompts34.com/rehber',
      ...GUIDES.map((guide) => `https://prompts34.com${getGuidePath(guide)}`),
    ];

    expect(entries).toHaveLength(expectedStaticUrls.length + 2);
    expect(entries.map((entry) => entry.url)).toEqual([
      ...expectedStaticUrls,
      `https://prompts34.com${getPromptPath(promptUpdated)}`,
      `https://prompts34.com${getPromptPath(promptCreated)}`,
    ]);
    expect(entries[0]?.priority).toBe(1);
    expect(entries[0]?.lastModified).toBeInstanceOf(Date);
    expect(entries.at(-2)?.lastModified).toBe('2026-03-25T10:00:00.000Z');
    expect(entries.at(-1)?.lastModified).toBe('2026-03-21T10:00:00.000Z');
    expect(entries.map((entry) => entry.url)).not.toContain(
      'https://prompts34.com/cv-hazirlama',
    );
  });

  it('returns the static sitemap entries when the public prompt fetch fails', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    getPublicPromptsMock.mockRejectedValueOnce(new Error('boom'));

    try {
      const entries = await sitemap();
      const expectedStaticUrls = [
        'https://prompts34.com',
        'https://prompts34.com/araclar',
        ...TOOL_HUBS.map((hub) => `https://prompts34.com${hub.canonicalPath}`),
        'https://prompts34.com/en-yeni-prompts',
        'https://prompts34.com/one-cikanlar',
        'https://prompts34.com/ucretsiz-promptlar',
        'https://prompts34.com/prompts',
        'https://prompts34.com/kategori',
        ...TOPICS.map((topic) => `https://prompts34.com${getTopicPath(topic)}`),
        'https://prompts34.com/meslek',
        ...PROFESSIONS.map(
          (profession) =>
            `https://prompts34.com${getProfessionPath(profession)}`,
        ),
        'https://prompts34.com/kullanim',
        ...USE_CASES.map(
          (useCase) => `https://prompts34.com${getUseCasePath(useCase)}`,
        ),
        'https://prompts34.com/sozluk',
        ...GLOSSARY.map(
          (entry) => `https://prompts34.com${getGlossaryPath(entry)}`,
        ),
        'https://prompts34.com/rehber',
        ...GUIDES.map((guide) => `https://prompts34.com${getGuidePath(guide)}`),
      ];

      expect(entries.map((entry) => entry.url)).toEqual(expectedStaticUrls);
      expect(entries.map((entry) => entry.url)).not.toContain(
        'https://prompts34.com/cv-hazirlama',
      );
      expect(entries.every((entry) => entry.lastModified instanceof Date)).toBe(
        true,
      );
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});
