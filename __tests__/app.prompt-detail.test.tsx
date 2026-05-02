import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PromptDetailPage, { generateMetadata } from '@/app/prompts/[id]/page';
import { SOCIAL_IMAGE_PATH } from '@/app/shared-metadata';
import { getPrompt } from '@/lib/api/prompts';
import { getPromptPath } from '@/lib/utils/slug';
import { buildPrompt } from './test-utils/fixtures';

vi.mock('@/components/Navigation', () => ({
  default: () => <nav data-testid="navigation">Navigation</nav>,
}));

vi.mock('@/components/CopyContentButton', () => ({
  default: ({ content }: { content: string }) => (
    <button type="button">Copy: {content}</button>
  ),
}));

vi.mock('@/components/PromptVoteButton', () => ({
  default: ({
    initialLikeCount,
  }: {
    promptId: string;
    initialLikeCount: number;
    initialLikedByMe: boolean;
  }) => <button type="button">Vote: {initialLikeCount}</button>,
}));

vi.mock('@/components/CommentSection', () => ({
  default: ({
    initialCommentCount,
  }: {
    promptId: string;
    promptOwnerId: string;
    initialCommentCount: number;
  }) => <div>Yorumlar ({initialCommentCount})</div>,
}));

vi.mock('@/lib/api/prompts', () => ({
  getPrompt: vi.fn(),
}));

describe('prompt detail page', () => {
  const getPromptMock = vi.mocked(getPrompt);

  it('renders the prompt detail with explanation, tags, and actions', async () => {
    getPromptMock.mockResolvedValueOnce(
      buildPrompt({
        title: 'Detaylı Prompt',
        content: 'Prompt içeriği',
        tags: ['cv', 'analiz'],
        explanation: 'Uzun açıklama',
        suggested_model: 'GPT-4',
        like_count: 12,
      }),
    );

    render(
      await PromptDetailPage({ params: Promise.resolve({ id: 'prompt-1' }) }),
    );

    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Detaylı Prompt' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Uzun açıklama')).toBeInTheDocument();
    expect(screen.getByText('cv')).toBeInTheDocument();
    expect(screen.getByText('analiz')).toBeInTheDocument();
    expect(screen.getByText('Copy: Prompt içeriği')).toBeInTheDocument();
    expect(screen.getByText('Vote: 12')).toBeInTheDocument();
    expect(screen.getByText('Yorumlar (0)')).toBeInTheDocument();
  });

  it('renders prompts without an explanation', async () => {
    getPromptMock.mockResolvedValueOnce(
      buildPrompt({
        id: 'prompt-2',
        title: 'Açıklamasız Prompt',
        content: 'Sade içerik',
        tags: ['etiket'],
        explanation: null,
        suggested_model: null,
        like_count: 1,
        liked_by_me: true,
      }),
    );

    render(
      await PromptDetailPage({ params: Promise.resolve({ id: 'prompt-2' }) }),
    );

    expect(screen.queryByText('Uzun açıklama')).not.toBeInTheDocument();
    expect(screen.getByText('Açıklamasız Prompt')).toBeInTheDocument();
  });

  it('delegates missing prompts to notFound', async () => {
    getPromptMock.mockRejectedValueOnce(new Error('missing'));

    await expect(
      PromptDetailPage({ params: Promise.resolve({ id: 'missing' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });
});

describe('generateMetadata', () => {
  const getPromptMock = vi.mocked(getPrompt);

  it('uses the prompt title as the metadata title', async () => {
    getPromptMock.mockResolvedValueOnce(
      buildPrompt({ id: 'p1', title: 'Harika Prompt' }),
    );

    const metadata = await generateMetadata({
      params: Promise.resolve({ id: 'p1' }),
    });

    expect(metadata.title).toBe('Harika Prompt');
  });

  it('sets the canonical to the absolute slug URL', async () => {
    const prompt = buildPrompt({ id: 'abc-123', title: 'Test' });
    getPromptMock.mockResolvedValueOnce(prompt);

    const metadata = await generateMetadata({
      params: Promise.resolve({ id: 'abc-123' }),
    });

    expect(metadata.alternates?.canonical).toBe(
      `https://prompts34.com${getPromptPath(prompt)}`,
    );
  });

  it('prefers explanation as the description', async () => {
    getPromptMock.mockResolvedValueOnce(
      buildPrompt({
        id: 'p2',
        explanation: 'Bu bir aciklama.',
        content: 'Bu icerik metnidir.',
      }),
    );

    const metadata = await generateMetadata({
      params: Promise.resolve({ id: 'p2' }),
    });

    expect(metadata.description).toBe('Bu bir aciklama.');
  });

  it('decodes entities and uses the same description for social metadata', async () => {
    getPromptMock.mockResolvedValueOnce(
      buildPrompt({
        id: 'p-entity',
        explanation:
          'Bu prompt &quot;iPhone ile çekilmiş&quot; hissi veren doğal ışık üretir.',
        content: 'Fallback content',
      }),
    );

    const metadata = await generateMetadata({
      params: Promise.resolve({ id: 'p-entity' }),
    });

    const expected =
      'Bu prompt "iPhone ile çekilmiş" hissi veren doğal ışık üretir.';
    expect(metadata.description).toBe(expected);
    expect(metadata.openGraph?.description).toBe(expected);
    expect(metadata.twitter?.description).toBe(expected);
  });

  it('keeps the shared social preview image metadata', async () => {
    getPromptMock.mockResolvedValueOnce(
      buildPrompt({ id: 'p-social', title: 'Sosyal Preview Testi' }),
    );

    const metadata = await generateMetadata({
      params: Promise.resolve({ id: 'p-social' }),
    });

    expect(metadata.openGraph?.images).toEqual([
      {
        url: SOCIAL_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: 'Prompts34 - Yapay Zeka Promptları',
      },
    ]);
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      images: [SOCIAL_IMAGE_PATH],
    });
  });

  it('falls back to truncated content when explanation is absent', async () => {
    const longContent =
      'Bu çok uzun prompt açıklaması sosyal medya ön izlemelerinde düzgün görünmeli ve kesinlikle kelimelerin ortasından kesilmemeli çünkü arama sonuçlarında kötü görünür.';
    getPromptMock.mockResolvedValueOnce(
      buildPrompt({ id: 'p3', explanation: null, content: longContent }),
    );

    const metadata = await generateMetadata({
      params: Promise.resolve({ id: 'p3' }),
    });

    expect(metadata.description).toBe(
      'Bu çok uzun prompt açıklaması sosyal medya ön izlemelerinde düzgün görünmeli ve kesinlikle kelimelerin ortasından kesilmemeli çünkü arama sonuçlarında…',
    );
    expect(metadata.openGraph?.description).toBe(metadata.description);
    expect(metadata.twitter?.description).toBe(metadata.description);
  });

  it('surfaces notFound when the prompt is missing', async () => {
    getPromptMock.mockRejectedValueOnce(new Error('not found'));

    await expect(
      generateMetadata({ params: Promise.resolve({ id: 'gone' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });
});
