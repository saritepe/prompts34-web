import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PromptDetailPage from '@/app/prompts/[id]/page';
import { getPrompt } from '@/lib/api/prompts';

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

vi.mock('@/lib/api/prompts', () => ({
  getPrompt: vi.fn(),
}));

describe('prompt detail page', () => {
  const getPromptMock = vi.mocked(getPrompt);

  it('renders the prompt detail with explanation, tags, and actions', async () => {
    getPromptMock.mockResolvedValueOnce({
      id: 'prompt-1',
      user_id: 'user-1',
      title: 'Detaylı Prompt',
      content: 'Prompt içeriği',
      tags: ['cv', 'analiz'],
      explanation: 'Uzun açıklama',
      suggested_model: 'GPT-4',
      is_public: true,
      like_count: 12,
      liked_by_me: false,
      created_at: '2026-03-20T10:00:00.000Z',
      updated_at: '2026-03-20T10:00:00.000Z',
    });

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
    getPromptMock.mockResolvedValueOnce({
      id: 'prompt-2',
      user_id: 'user-1',
      title: 'Açıklamasız Prompt',
      content: 'Sade içerik',
      tags: ['etiket'],
      explanation: null,
      suggested_model: null,
      is_public: true,
      like_count: 1,
      liked_by_me: true,
      created_at: '2026-03-20T10:00:00.000Z',
      updated_at: '2026-03-20T10:00:00.000Z',
    });

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
