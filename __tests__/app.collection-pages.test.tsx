import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ChatGPTPromptlariPage, {
  dynamic as chatgptDynamic,
  metadata as chatgptMetadata,
} from '@/app/chatgpt-promptlari/page';
import CVHazirlamaPage, {
  dynamic as cvDynamic,
  metadata as cvMetadata,
} from '@/app/cv-hazirlama/page';
import GeminiPromptlariPage, {
  dynamic as geminiDynamic,
  metadata as geminiMetadata,
} from '@/app/gemini-promptlari/page';
import LatestPromptsPage, {
  metadata as latestMetadata,
} from '@/app/en-yeni-prompts/page';
import GorselOlusturmaPage, {
  dynamic as gorselDynamic,
  metadata as gorselMetadata,
} from '@/app/gorsel-olusturma/page';
import LogoOlusturmaPage, {
  dynamic as logoDynamic,
  metadata as logoMetadata,
} from '@/app/logo-olusturma/page';
import MotivasyonMektubuPage, {
  dynamic as motivasyonDynamic,
  metadata as motivasyonMetadata,
} from '@/app/motivasyon-mektubu/page';
import MulakatHazirligiPage, {
  dynamic as mulakatDynamic,
  metadata as mulakatMetadata,
} from '@/app/mulakat-hazirligi/page';
import FeaturedPromptsPage, {
  metadata as featuredMetadata,
} from '@/app/one-cikanlar/page';
import { SOCIAL_IMAGE_PATH } from '@/app/shared-metadata';
import { getPromptsByTags, getPublicPrompts } from '@/lib/api/prompts';
import { buildPrompt } from './test-utils/fixtures';

vi.mock('@/components/Navigation', () => ({
  default: () => <nav data-testid="navigation">Navigation</nav>,
}));

vi.mock('@/lib/api/prompts', () => ({
  getPromptsByTags: vi.fn(),
  getPublicPrompts: vi.fn(),
}));

describe('collection and listing pages', () => {
  const getPromptsByTagsMock = vi.mocked(getPromptsByTags);
  const getPublicPromptsMock = vi.mocked(getPublicPrompts);

  const collectionPages = [
    {
      name: 'CV Hazirlama',
      component: CVHazirlamaPage,
      metadata: cvMetadata,
      dynamic: cvDynamic,
      tag: 'cv',
      heading: 'CV Hazırlama Promptları',
      emptyMessage: 'Henüz CV hazırlama ile ilgili prompt bulunmuyor.',
      canonical: 'https://prompts34.com/cv-hazirlama',
    },
    {
      name: 'Gorsel Olusturma',
      component: GorselOlusturmaPage,
      metadata: gorselMetadata,
      dynamic: gorselDynamic,
      tag: 'image-generation',
      heading: 'Görsel Oluşturma Promptları',
      emptyMessage: 'Henüz görsel oluşturma ile ilgili prompt bulunmuyor.',
      canonical: 'https://prompts34.com/gorsel-olusturma',
    },
    {
      name: 'Logo Olusturma',
      component: LogoOlusturmaPage,
      metadata: logoMetadata,
      dynamic: logoDynamic,
      tag: 'logo oluşturma',
      heading: 'Logo Oluşturma Promptları',
      emptyMessage: 'Henüz logo oluşturma ile ilgili prompt bulunmuyor.',
      canonical: 'https://prompts34.com/logo-olusturma',
    },
    {
      name: 'Motivasyon Mektubu',
      component: MotivasyonMektubuPage,
      metadata: motivasyonMetadata,
      dynamic: motivasyonDynamic,
      tag: 'motivasyon-mektubu',
      heading: 'Motivasyon Mektubu Promptları',
      emptyMessage: 'Henüz motivasyon mektubu ile ilgili prompt bulunmuyor.',
      canonical: 'https://prompts34.com/motivasyon-mektubu',
    },
    {
      name: 'Mulakat Hazirligi',
      component: MulakatHazirligiPage,
      metadata: mulakatMetadata,
      dynamic: mulakatDynamic,
      tag: 'mulakat',
      heading: 'Mülakat Hazırlığı Promptları',
      emptyMessage: 'Henüz mülakat hazırlığı ile ilgili prompt bulunmuyor.',
      canonical: 'https://prompts34.com/mulakat-hazirligi',
    },
  ] as const;

  describe.each(collectionPages)('$name page', (pageConfig) => {
    it('renders prompts for the collection', async () => {
      const prompts = [
        buildPrompt({
          id: 'prompt-1',
          title: `${pageConfig.heading} Başlık`,
          tags: [pageConfig.tag],
          username: 'ali',
          suggested_model: 'GPT-4',
        }),
        buildPrompt({
          id: 'prompt-2',
          title: `${pageConfig.heading} Minimal`,
          tags: [pageConfig.tag],
          username: undefined,
          explanation: null,
          suggested_model: null,
        }),
      ];
      getPromptsByTagsMock.mockResolvedValueOnce(prompts);

      render(await pageConfig.component());

      expect(screen.getByTestId('navigation')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: pageConfig.heading }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(`${pageConfig.heading} Başlık`),
      ).toBeInTheDocument();
      expect(
        screen.getByText(`${pageConfig.heading} Minimal`),
      ).toBeInTheDocument();
      expect(screen.getByText('@ali')).toBeInTheDocument();
      expect(screen.getByText('Önerilen model: GPT-4')).toBeInTheDocument();
      prompts.forEach((prompt) => {
        expect(
          screen.getByRole('link', { name: prompt.title }),
        ).toHaveAttribute('href', `/prompts/${prompt.id}`);
      });
      expect(
        screen
          .getAllByRole('link')
          .filter((link) => link.getAttribute('href')?.startsWith('/prompts/')),
      ).toHaveLength(prompts.length);
      expect(getPromptsByTagsMock).toHaveBeenCalledWith([pageConfig.tag]);
    });

    it('renders the empty state when no prompts are returned', async () => {
      getPromptsByTagsMock.mockResolvedValueOnce([]);

      render(await pageConfig.component());

      expect(screen.getByText(pageConfig.emptyMessage)).toBeInTheDocument();
    });

    it('renders the error state when fetching prompts fails', async () => {
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      getPromptsByTagsMock.mockRejectedValueOnce(new Error('boom'));

      render(await pageConfig.component());

      expect(
        screen.getByText('Promptlar yüklenirken bir hata oluştu'),
      ).toBeInTheDocument();

      consoleError.mockRestore();
    });

    it('exports the expected route metadata', () => {
      expect(pageConfig.dynamic).toBe('force-dynamic');
      expect(pageConfig.metadata.title).toContain(pageConfig.heading);
      expect(pageConfig.metadata.alternates?.canonical).toBe(
        pageConfig.canonical,
      );
      expect(pageConfig.metadata.openGraph?.images).toEqual([
        {
          url: SOCIAL_IMAGE_PATH,
          width: 1200,
          height: 630,
          alt: 'Prompts34 - Yapay Zeka Promptları',
        },
      ]);
      expect(pageConfig.metadata.twitter?.images).toEqual([SOCIAL_IMAGE_PATH]);
    });
  });

  it('renders latest prompts sorted by date descending', async () => {
    getPublicPromptsMock.mockResolvedValueOnce([
      buildPrompt({
        id: 'older',
        title: 'Eski Prompt',
        created_at: '2026-03-19T10:00:00.000Z',
      }),
      buildPrompt({
        id: 'newer',
        title: 'Yeni Prompt',
        explanation: null,
        created_at: '2026-03-21T10:00:00.000Z',
      }),
    ]);

    render(await LatestPromptsPage());

    const headings = screen.getAllByRole('heading', { level: 2 });
    expect(headings[0]).toHaveTextContent('Yeni Prompt');
    expect(headings[1]).toHaveTextContent('Eski Prompt');
    expect(screen.getByRole('link', { name: 'Ana Sayfa' })).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('renders the latest prompts empty state when the fetch fails', async () => {
    getPublicPromptsMock.mockRejectedValueOnce(new Error('boom'));

    render(await LatestPromptsPage());

    expect(screen.getByText('Henüz prompt bulunmuyor.')).toBeInTheDocument();
  });

  it('exports the expected latest prompts metadata', () => {
    expect(latestMetadata.title).toBe('En Yeni Promptlar');
    expect(latestMetadata.description).toBe(
      'Prompts34 üzerindeki en yeni yapay zeka promptlarını keşfedin. ChatGPT, Claude ve diğer AI araçları için son eklenen promptlar.',
    );
    expect(latestMetadata.alternates?.canonical).toBe(
      'https://prompts34.com/en-yeni-prompts',
    );
    expect(latestMetadata.openGraph?.images).toEqual([
      {
        url: SOCIAL_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: 'Prompts34 - Yapay Zeka Promptları',
      },
    ]);
    expect(latestMetadata.twitter?.images).toEqual([SOCIAL_IMAGE_PATH]);
  });

  it('renders featured prompts sorted by likes and then by date', async () => {
    getPublicPromptsMock.mockResolvedValueOnce([
      buildPrompt({
        id: 'older-top',
        title: 'Eski Popüler Prompt',
        like_count: 9,
        created_at: '2026-03-18T10:00:00.000Z',
      }),
      buildPrompt({
        id: 'newer-top',
        title: 'Yeni Popüler Prompt',
        explanation: null,
        like_count: 9,
        created_at: '2026-03-21T10:00:00.000Z',
      }),
      buildPrompt({
        id: 'less-liked',
        title: 'Az Oy Alan Prompt',
        like_count: 2,
      }),
    ]);

    render(await FeaturedPromptsPage());

    const headings = screen.getAllByRole('heading', { level: 2 });
    expect(headings[0]).toHaveTextContent('Yeni Popüler Prompt');
    expect(headings[1]).toHaveTextContent('Eski Popüler Prompt');
    expect(headings[2]).toHaveTextContent('Az Oy Alan Prompt');
    expect(
      screen.getByText('Oylara göre azalan sırada tüm promptlar.'),
    ).toBeInTheDocument();
  });

  it('renders the featured prompts empty state when the fetch fails', async () => {
    getPublicPromptsMock.mockRejectedValueOnce(new Error('boom'));

    render(await FeaturedPromptsPage());

    expect(screen.getByText('Henüz prompt bulunmuyor.')).toBeInTheDocument();
  });

  const toolHubPages = [
    {
      name: 'ChatGPT Promptlari',
      component: ChatGPTPromptlariPage,
      metadata: chatgptMetadata,
      dynamic: chatgptDynamic,
      heading: 'ChatGPT Promptları',
      emptyMessage: 'Henüz ChatGPT ile ilgili prompt bulunmuyor.',
      canonical: 'https://prompts34.com/chatgpt-promptlari',
      matchingPrompt: buildPrompt({
        id: 'chatgpt-match',
        title: 'ChatGPT ile Blog Yazısı',
        tags: ['icerik'],
        suggested_model: 'GPT-4o',
      }),
      nonMatchingPrompt: buildPrompt({
        id: 'claude-non-match',
        title: 'Claude ile Analiz',
        tags: ['analiz'],
        suggested_model: 'Claude 3.5 Sonnet',
      }),
    },
    {
      name: 'Gemini Promptlari',
      component: GeminiPromptlariPage,
      metadata: geminiMetadata,
      dynamic: geminiDynamic,
      heading: 'Gemini Promptları',
      emptyMessage: 'Henüz Gemini ile ilgili prompt bulunmuyor.',
      canonical: 'https://prompts34.com/gemini-promptlari',
      matchingPrompt: buildPrompt({
        id: 'gemini-match',
        title: 'Gemini ile Özetleme',
        tags: ['ozet'],
        suggested_model: 'Gemini Pro',
      }),
      nonMatchingPrompt: buildPrompt({
        id: 'chatgpt-non-match',
        title: 'ChatGPT ile Blog Yazısı',
        tags: ['icerik'],
        suggested_model: 'GPT-4',
      }),
    },
  ] as const;

  describe.each(toolHubPages)('$name page', (pageConfig) => {
    it('renders only prompts matching the tool hub', async () => {
      getPublicPromptsMock.mockResolvedValueOnce([
        pageConfig.matchingPrompt,
        pageConfig.nonMatchingPrompt,
      ]);

      render(await pageConfig.component());

      expect(
        screen.getByRole('heading', { name: pageConfig.heading }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(pageConfig.matchingPrompt.title),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(pageConfig.nonMatchingPrompt.title),
      ).not.toBeInTheDocument();
    });

    it('renders the empty state when nothing matches', async () => {
      getPublicPromptsMock.mockResolvedValueOnce([
        pageConfig.nonMatchingPrompt,
      ]);

      render(await pageConfig.component());

      expect(screen.getByText(pageConfig.emptyMessage)).toBeInTheDocument();
    });

    it('renders the error state when fetching prompts fails', async () => {
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      getPublicPromptsMock.mockRejectedValueOnce(new Error('boom'));

      render(await pageConfig.component());

      expect(
        screen.getByText('Promptlar yüklenirken bir hata oluştu'),
      ).toBeInTheDocument();

      consoleError.mockRestore();
    });

    it('exports the expected route metadata', () => {
      expect(pageConfig.dynamic).toBe('force-dynamic');
      expect(pageConfig.metadata.title).toBe(pageConfig.heading);
      expect(pageConfig.metadata.alternates?.canonical).toBe(
        pageConfig.canonical,
      );
      expect(pageConfig.metadata.openGraph?.images).toEqual([
        {
          url: SOCIAL_IMAGE_PATH,
          width: 1200,
          height: 630,
          alt: 'Prompts34 - Yapay Zeka Promptları',
        },
      ]);
      expect(pageConfig.metadata.twitter?.images).toEqual([SOCIAL_IMAGE_PATH]);
    });
  });

  it('exports the expected featured prompts metadata', () => {
    expect(featuredMetadata.title).toBe('Öne Çıkan Promptlar');
    expect(featuredMetadata.description).toBe(
      'Prompts34 üzerindeki en çok beğenilen yapay zeka promptlarını keşfedin. ChatGPT, Claude ve diğer AI araçları için öne çıkan promptlar.',
    );
    expect(featuredMetadata.alternates?.canonical).toBe(
      'https://prompts34.com/one-cikanlar',
    );
    expect(featuredMetadata.openGraph?.images).toEqual([
      {
        url: SOCIAL_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: 'Prompts34 - Yapay Zeka Promptları',
      },
    ]);
    expect(featuredMetadata.twitter?.images).toEqual([SOCIAL_IMAGE_PATH]);
  });
});
