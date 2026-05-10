import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PromptDetailClient from '@/components/PromptDetailClient';
import { getPrompt, updatePrompt } from '@/lib/api/prompts';
import { buildPrompt } from './test-utils/fixtures';

const authState = vi.hoisted(() => ({
  user: {
    email: 'user@example.com',
    username: 'ali',
    id: 'user-1',
  } as { email: string; username: string; id?: string } | null,
  token: 'token-1' as string | null,
}));

const formPayload = vi.hoisted(() => ({
  title: 'Güncellenen Başlık',
  content: 'Güncellenen içerik',
  tags: ['güncel'],
  explanation: 'Güncellenen açıklama',
  suggested_model: 'Gemini',
  is_public: true,
}));

vi.mock('@/lib/auth', () => ({
  useAuth: () => authState,
}));

vi.mock('@/components/Navigation', () => ({
  default: () => <nav data-testid="navigation">Navigation</nav>,
}));

vi.mock('@/components/CopyContentButton', () => ({
  default: ({ content }: { content: string }) => (
    <button type="button">Copy: {content}</button>
  ),
}));

vi.mock('@/components/PromptVoteButton', () => ({
  default: ({ initialLikeCount }: { initialLikeCount: number }) => (
    <button type="button">Vote: {initialLikeCount}</button>
  ),
}));

vi.mock('@/components/CommentSection', () => ({
  default: ({ initialCommentCount }: { initialCommentCount: number }) => (
    <div>Yorumlar ({initialCommentCount})</div>
  ),
}));

vi.mock('@/components/PromptForm', () => ({
  default: ({
    initialData,
    onCancel,
    onSubmit,
    submitLabel,
  }: {
    initialData?: { title?: string };
    onCancel?: () => void;
    onSubmit: (payload: typeof formPayload) => Promise<void>;
    submitLabel?: string;
  }) => (
    <div data-testid="edit-form">
      {initialData?.title && <span>{initialData.title}</span>}
      <button type="button" onClick={() => void onSubmit(formPayload)}>
        {submitLabel}
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel}>
          Form İptal
        </button>
      )}
    </div>
  ),
}));

vi.mock('@/lib/api/prompts', () => ({
  getPrompt: vi.fn(),
  updatePrompt: vi.fn(),
}));

describe('PromptDetailClient', () => {
  const getPromptMock = vi.mocked(getPrompt);
  const updatePromptMock = vi.mocked(updatePrompt);
  const scrollIntoViewMock = vi.fn();

  beforeEach(() => {
    Element.prototype.scrollIntoView = scrollIntoViewMock;
    scrollIntoViewMock.mockReset();
    getPromptMock.mockReset();
    updatePromptMock.mockReset();
    authState.user = {
      email: 'user@example.com',
      username: 'ali',
      id: 'user-1',
    };
    authState.token = 'token-1';
  });

  it('shows edit action for the owner and updates the prompt inline', async () => {
    updatePromptMock.mockResolvedValueOnce(
      buildPrompt({
        id: 'prompt-1',
        user_id: 'user-1',
        title: 'Güncellenen Başlık',
        explanation: 'Güncellenen açıklama',
        content: 'Güncellenen içerik',
        tags: ['güncel'],
      }),
    );

    render(
      <PromptDetailClient
        prompt={buildPrompt({ id: 'prompt-1', user_id: 'user-1' })}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Düzenle' }));

    expect(screen.getByTestId('edit-form')).toBeInTheDocument();
    expect(scrollIntoViewMock).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Güncelle' }));

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: 'Güncellenen Başlık' }),
      ).toBeInTheDocument(),
    );
    expect(updatePromptMock).toHaveBeenCalledWith(
      'prompt-1',
      formPayload,
      'token-1',
    );
  });

  it('hides edit action for non-owners', () => {
    render(
      <PromptDetailClient
        prompt={buildPrompt({ id: 'prompt-1', user_id: 'someone-else' })}
      />,
    );

    expect(
      screen.queryByRole('button', { name: 'Düzenle' }),
    ).not.toBeInTheDocument();
  });

  it('gates prompt content for logged-out visitors', () => {
    authState.user = null;
    authState.token = null;

    render(
      <PromptDetailClient
        prompt={buildPrompt({
          id: 'prompt-locked',
          content: '',
          title: 'Gizli Prompt',
        })}
      />,
    );

    expect(screen.getByText('Bu Prompt Seni Bekliyor')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Giriş Yap' })).toHaveAttribute(
      'href',
      '/giris',
    );
    expect(screen.getByRole('link', { name: 'Kayıt Ol' })).toHaveAttribute(
      'href',
      '/kayit',
    );
    expect(screen.queryByText('Copy:')).not.toBeInTheDocument();
  });
});
