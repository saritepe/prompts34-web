import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CVHazirlamaPage, {
  dynamic as cvDynamic,
  metadata as cvMetadata,
} from '@/app/cv-hazirlama/page';
import LatestPromptsPage from '@/app/en-yeni-prompts/page';
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
import FeaturedPromptsPage from '@/app/one-cikanlar/page';
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
      getPromptsByTagsMock.mockResolvedValueOnce([
        buildPrompt({
          title: `${pageConfig.heading} Başlık`,
          tags: [pageConfig.tag],
          username: 'ali',
          suggested_model: 'GPT-4',
        }),
        buildPrompt({
          id: `${pageConfig.tag}-minimal`,
          title: `${pageConfig.heading} Minimal`,
          tags: [pageConfig.tag],
          username: undefined,
          explanation: null,
          suggested_model: null,
        }),
      ]);

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
});
