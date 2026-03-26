import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import RootLayout, { metadata } from '@/app/layout';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { SOCIAL_IMAGE_PATH } from '@/app/shared-metadata';

describe('layout and metadata routes', () => {
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

  it('returns the expected sitemap entries', () => {
    const entries = sitemap();

    expect(entries).toHaveLength(6);
    expect(entries.map((entry) => entry.url)).toEqual([
      'https://prompts34.com',
      'https://prompts34.com/cv-hazirlama',
      'https://prompts34.com/motivasyon-mektubu',
      'https://prompts34.com/mulakat-hazirligi',
      'https://prompts34.com/gorsel-olusturma',
      'https://prompts34.com/logo-olusturma',
    ]);
    expect(entries[0]?.priority).toBe(1);
    expect(entries[1]?.changeFrequency).toBe('daily');
  });
});
