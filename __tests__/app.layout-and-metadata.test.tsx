import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import RootLayout, { metadata } from '@/app/layout';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { SOCIAL_IMAGE_PATH } from '@/app/shared-metadata';
import { getPublicPrompts } from '@/lib/api/prompts';
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
        'Prompts34 | Yapay Zeka Promptları - ChatGPT, Claude, AI Prompt Kütüphanesi',
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
    getPublicPromptsMock.mockResolvedValueOnce([
      buildPrompt({
        id: 'prompt-updated',
        created_at: '2026-03-20T10:00:00.000Z',
        updated_at: '2026-03-25T10:00:00.000Z',
      }),
      buildPrompt({
        id: 'prompt-created',
        created_at: '2026-03-21T10:00:00.000Z',
        updated_at: '',
      }),
    ]);

    const entries = await sitemap();

    expect(entries).toHaveLength(20);
    expect(entries.map((entry) => entry.url)).toEqual([
      'https://prompts34.com',
      'https://prompts34.com/cv-hazirlama',
      'https://prompts34.com/motivasyon-mektubu',
      'https://prompts34.com/mulakat-hazirligi',
      'https://prompts34.com/gorsel-olusturma',
      'https://prompts34.com/logo-olusturma',
      'https://prompts34.com/chatgpt-promptlari',
      'https://prompts34.com/gemini-promptlari',
      'https://prompts34.com/en-yeni-prompts',
      'https://prompts34.com/one-cikanlar',
      'https://prompts34.com/konular',
      'https://prompts34.com/konular/pazarlama-ve-icerik',
      'https://prompts34.com/konular/sanat-ve-yaraticilik',
      'https://prompts34.com/konular/portre-ve-fotograf',
      'https://prompts34.com/konular/is-stratejisi',
      'https://prompts34.com/konular/yazilim-gelistirme',
      'https://prompts34.com/konular/midjourney-gorsel',
      'https://prompts34.com/konular/kariyer-gelisim',
      'https://prompts34.com/prompts/prompt-updated',
      'https://prompts34.com/prompts/prompt-created',
    ]);
    expect(entries[0]?.priority).toBe(1);
    expect(entries[1]?.changeFrequency).toBe('daily');
    expect(entries[10]?.changeFrequency).toBe('weekly');
    expect(entries[10]?.priority).toBe(0.8);
    expect(entries[0]?.lastModified).toBeUndefined();
    expect(entries[1]?.lastModified).toBeUndefined();
    expect(entries[18]?.lastModified).toBe('2026-03-25T10:00:00.000Z');
    expect(entries[19]?.lastModified).toBe('2026-03-21T10:00:00.000Z');
  });

  it('returns the static sitemap entries when the public prompt fetch fails', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    getPublicPromptsMock.mockRejectedValueOnce(new Error('boom'));

    try {
      const entries = await sitemap();

      expect(entries.map((entry) => entry.url)).toEqual([
        'https://prompts34.com',
        'https://prompts34.com/cv-hazirlama',
        'https://prompts34.com/motivasyon-mektubu',
        'https://prompts34.com/mulakat-hazirligi',
        'https://prompts34.com/gorsel-olusturma',
        'https://prompts34.com/logo-olusturma',
        'https://prompts34.com/chatgpt-promptlari',
        'https://prompts34.com/gemini-promptlari',
        'https://prompts34.com/en-yeni-prompts',
        'https://prompts34.com/one-cikanlar',
        'https://prompts34.com/konular',
        'https://prompts34.com/konular/pazarlama-ve-icerik',
        'https://prompts34.com/konular/sanat-ve-yaraticilik',
        'https://prompts34.com/konular/portre-ve-fotograf',
        'https://prompts34.com/konular/is-stratejisi',
        'https://prompts34.com/konular/yazilim-gelistirme',
        'https://prompts34.com/konular/midjourney-gorsel',
        'https://prompts34.com/konular/kariyer-gelisim',
      ]);
      expect(entries.every((entry) => entry.lastModified === undefined)).toBe(
        true,
      );
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});
