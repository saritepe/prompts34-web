import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TopicPage, {
  revalidate as topicRevalidate,
  generateMetadata,
} from '@/app/kategori/[slug]/page';
import KategoriHubPage, {
  revalidate as hubRevalidate,
  metadata as hubMetadata,
} from '@/app/kategori/page';
import { SOCIAL_IMAGE_PATH } from '@/app/shared-metadata';
import { getPublicPrompts } from '@/lib/api/prompts';
import {
  TOPIC_PAGES,
  findTopicByKeyword,
  getTopicPath,
  getTopicBySlug,
  matchPromptsForTopic,
  normalizeQuery,
} from '@/lib/topics';
import { getPromptPath } from '@/lib/utils/slug';
import { buildPrompt } from './test-utils/fixtures';

vi.mock('@/components/Navigation', () => ({
  default: () => <nav data-testid="navigation">Navigation</nav>,
}));

vi.mock('@/lib/api/prompts', () => ({
  getPublicPrompts: vi.fn(),
}));

const notFoundMock = vi.fn();
vi.mock('next/navigation', () => ({
  notFound: () => {
    notFoundMock();
    throw new Error('NEXT_NOT_FOUND');
  },
}));

describe('search landing pages', () => {
  const getPublicPromptsMock = vi.mocked(getPublicPrompts);

  describe('topic definitions', () => {
    it('returns a topic for each defined slug', () => {
      for (const topic of TOPIC_PAGES) {
        expect(getTopicBySlug(topic.slug)).toBe(topic);
      }
    });

    it('returns undefined for unknown slugs', () => {
      expect(getTopicBySlug('nonexistent')).toBeUndefined();
    });

    it('has unique slugs across all topics', () => {
      const slugs = TOPIC_PAGES.map((t) => t.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    });

    it('normalizes Turkish search queries and matches exact topic keywords', () => {
      expect(normalizeQuery('  Özgeçmiş  ')).toBe('ozgecmis');
      expect(findTopicByKeyword('cv')?.slug).toBe('cv-hazirlama');
      expect(findTopicByKeyword('özgeçmiş')?.slug).toBe('cv-hazirlama');
      expect(findTopicByKeyword('unknown')).toBeUndefined();
    });
  });

  describe('matchPromptsForTopic', () => {
    const topic = getTopicBySlug('pazarlama-ve-icerik')!;

    it('matches prompts with overlapping tags (case-insensitive)', () => {
      const prompts = [
        buildPrompt({ id: 'match', tags: ['Pazarlama', 'diğer'] }),
        buildPrompt({ id: 'no-match', tags: ['yazılım'] }),
      ];

      const result = matchPromptsForTopic(prompts, topic);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('match');
    });

    it('sorts by like_count desc then created_at desc', () => {
      const prompts = [
        buildPrompt({
          id: 'low-likes-old',
          tags: ['pazarlama'],
          like_count: 1,
          created_at: '2026-03-01T00:00:00.000Z',
        }),
        buildPrompt({
          id: 'high-likes',
          tags: ['sosyal medya'],
          like_count: 10,
          created_at: '2026-03-01T00:00:00.000Z',
        }),
        buildPrompt({
          id: 'low-likes-new',
          tags: ['seo'],
          like_count: 1,
          created_at: '2026-03-20T00:00:00.000Z',
        }),
      ];

      const result = matchPromptsForTopic(prompts, topic);

      expect(result.map((p) => p.id)).toEqual([
        'high-likes',
        'low-likes-new',
        'low-likes-old',
      ]);
    });

    it('excludes prompts by id when excludedPromptIds is set', () => {
      const topicWithExclusion = {
        ...topic,
        excludedPromptIds: ['excluded-1'],
      };
      const prompts = [
        buildPrompt({ id: 'excluded-1', tags: ['pazarlama'] }),
        buildPrompt({ id: 'kept', tags: ['pazarlama'] }),
      ];

      const result = matchPromptsForTopic(prompts, topicWithExclusion);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('kept');
    });
  });

  describe('categories hub page (/kategori)', () => {
    it('renders all topic links', () => {
      render(<KategoriHubPage />);

      expect(screen.getByTestId('navigation')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'AI Prompt Kategorileri' }),
      ).toBeInTheDocument();

      for (const topic of TOPIC_PAGES) {
        expect(screen.getByText(topic.title)).toBeInTheDocument();
        const link = screen.getByText(topic.title).closest('a');
        expect(link).toHaveAttribute('href', getTopicPath(topic));
      }
    });

    it('exports the expected hub metadata', () => {
      expect(hubRevalidate).toBe(false);
      expect(hubMetadata.title).toBe('AI Prompt Kategorileri');
      expect(hubMetadata.alternates?.canonical).toBe(
        'https://prompts34.com/kategori',
      );
      expect(hubMetadata.openGraph?.images).toEqual([
        {
          url: SOCIAL_IMAGE_PATH,
          width: 1200,
          height: 630,
          alt: 'Prompts34 - Yapay Zeka Promptları',
        },
      ]);
      expect(hubMetadata.twitter?.images).toEqual([SOCIAL_IMAGE_PATH]);
    });
  });

  describe('category page (/kategori/[slug])', () => {
    const topic = getTopicBySlug('pazarlama-ve-icerik')!;

    it('renders matching prompts for a valid topic', async () => {
      const p1 = buildPrompt({
        id: 'p1',
        title: 'SEO Blog Yazısı',
        tags: ['seo', 'blog'],
        username: 'yazar',
        suggested_model: 'GPT-4',
      });
      const prompts = [
        p1,
        buildPrompt({
          id: 'p2',
          title: 'Sosyal Medya Postu',
          tags: ['sosyal medya'],
        }),
        buildPrompt({
          id: 'unrelated',
          title: 'Unrelated Prompt',
          tags: ['yazılım'],
        }),
      ];
      getPublicPromptsMock.mockResolvedValueOnce(prompts);

      render(
        await TopicPage({ params: Promise.resolve({ slug: topic.slug }) }),
      );

      expect(screen.getByTestId('navigation')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: topic.title }),
      ).toBeInTheDocument();
      expect(screen.getByText(topic.description)).toBeInTheDocument();
      expect(
        screen.getByRole('heading', {
          name: 'Bu kategorideki promptları nasıl kullanabilirsiniz?',
        }),
      ).toBeInTheDocument();
      expect(screen.getByText('SEO Blog Yazısı')).toBeInTheDocument();
      expect(screen.getByText('Sosyal Medya Postu')).toBeInTheDocument();
      expect(screen.queryByText('Unrelated Prompt')).not.toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'SEO Blog Yazısı' }),
      ).toHaveAttribute('href', getPromptPath(p1));
    });

    it('renders the empty state when no prompts match', async () => {
      getPublicPromptsMock.mockResolvedValueOnce([
        buildPrompt({ id: 'unrelated', tags: ['unrelated'] }),
      ]);

      render(
        await TopicPage({ params: Promise.resolve({ slug: topic.slug }) }),
      );

      expect(
        screen.getByText('Bu kategoride henüz prompt bulunmuyor.'),
      ).toBeInTheDocument();
    });

    it('renders the error state when fetching fails', async () => {
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      getPublicPromptsMock.mockRejectedValueOnce(new Error('boom'));

      render(
        await TopicPage({ params: Promise.resolve({ slug: topic.slug }) }),
      );

      expect(
        screen.getByText('Promptlar yüklenirken bir hata oluştu'),
      ).toBeInTheDocument();

      consoleError.mockRestore();
    });

    it('calls notFound for unknown slugs', async () => {
      await expect(
        TopicPage({ params: Promise.resolve({ slug: 'nonexistent' }) }),
      ).rejects.toThrow('NEXT_NOT_FOUND');

      expect(notFoundMock).toHaveBeenCalled();
    });

    it('exports revalidate = 300 for ISR', () => {
      expect(topicRevalidate).toBe(300);
    });

    it('generates metadata from the topic definition', async () => {
      const meta = await generateMetadata({
        params: Promise.resolve({ slug: topic.slug }),
      });

      expect(meta.title).toBe(`${topic.title} | Prompts34`);
      expect(meta.description).toBe(topic.description);
      expect(meta.alternates?.canonical).toBe(
        `https://prompts34.com${getTopicPath(topic)}`,
      );
      expect(meta.openGraph?.images).toEqual([
        {
          url: SOCIAL_IMAGE_PATH,
          width: 1200,
          height: 630,
          alt: 'Prompts34 - Yapay Zeka Promptları',
        },
      ]);
    });

    it('returns empty metadata for unknown slugs', async () => {
      const meta = await generateMetadata({
        params: Promise.resolve({ slug: 'unknown' }),
      });

      expect(meta).toEqual({});
    });
  });
});
