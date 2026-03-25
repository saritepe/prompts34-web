import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PromptDetailPage, { generateMetadata } from '@/app/prompts/[id]/page';
import { getPrompt } from '@/lib/api/prompts';
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

  it('sets the canonical to the prompt URL', async () => {
    getPromptMock.mockResolvedValueOnce(
      buildPrompt({ id: 'abc-123', title: 'Test' }),
    );

    const metadata = await generateMetadata({
      params: Promise.resolve({ id: 'abc-123' }),
    });

    expect(metadata.alternates?.canonical).toBe('/prompts/abc-123');
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

  it('falls back to truncated content when explanation is absent', async () => {
    const longContent = 'A'.repeat(200);
    getPromptMock.mockResolvedValueOnce(
      buildPrompt({ id: 'p3', explanation: null, content: longContent }),
    );

    const metadata = await generateMetadata({
      params: Promise.resolve({ id: 'p3' }),
    });

    expect(metadata.description).toHaveLength(155);
    expect(metadata.description).toBe('A'.repeat(155));
  });

  it('surfaces notFound when the prompt is missing', async () => {
    getPromptMock.mockRejectedValueOnce(new Error('not found'));

    await expect(
      generateMetadata({ params: Promise.resolve({ id: 'gone' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });
});
