import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CommentSection from '@/components/CommentSection';
import { getComments, createComment, deleteComment } from '@/lib/api/comments';
import { alertMock } from '../vitest.setup';
import type { CommentResponse } from '@/types/prompt';

// Hoist auth state so tests can override it
const authState = vi.hoisted(() => ({
  user: null as { id: string } | null,
  token: null as string | null,
}));

vi.mock('@/lib/auth', () => ({
  useAuth: () => authState,
}));

vi.mock('@/lib/api/comments', () => ({
  getComments: vi.fn(),
  createComment: vi.fn(),
  deleteComment: vi.fn(),
}));

function buildComment(
  overrides: Partial<CommentResponse> = {},
): CommentResponse {
  return {
    id: 'comment-1',
    prompt_id: 'prompt-1',
    user_id: 'user-1',
    username: 'testuser',
    content: 'Harika prompt!',
    created_at: '2026-03-24T00:00:00.000Z',
    updated_at: '2026-03-24T00:00:00.000Z',
    ...overrides,
  };
}

describe('CommentSection', () => {
  const getCommentsMock = vi.mocked(getComments);
  const createCommentMock = vi.mocked(createComment);
  const deleteCommentMock = vi.mocked(deleteComment);

  const defaultProps = {
    promptId: 'prompt-1',
    promptOwnerId: 'owner-user',
    initialCommentCount: 0,
  };

  beforeEach(() => {
    authState.user = null;
    authState.token = null;
    getCommentsMock.mockReset();
    createCommentMock.mockReset();
    deleteCommentMock.mockReset();
    getCommentsMock.mockResolvedValue([]);
  });

  describe('unauthenticated user', () => {
    it('shows a login prompt instead of the textarea when user is not logged in', async () => {
      authState.token = null;

      render(<CommentSection {...defaultProps} />);

      await waitFor(() =>
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument(),
      );

      expect(screen.getByText(/giriş yapın/i)).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /giriş yapın/i }),
      ).toHaveAttribute('href', '/giris');
    });
  });

  describe('authenticated user', () => {
    beforeEach(() => {
      authState.user = { id: 'user-1' };
      authState.token = 'auth-token';
    });

    it('shows the textarea and submit button when logged in', async () => {
      render(<CommentSection {...defaultProps} />);

      await waitFor(() =>
        expect(screen.getByPlaceholderText('Yorum yaz...')).toBeInTheDocument(),
      );

      expect(
        screen.getByRole('button', { name: 'Yorum Gönder' }),
      ).toBeInTheDocument();
    });

    it('disables the submit button when the textarea is empty', async () => {
      render(<CommentSection {...defaultProps} />);

      await waitFor(() =>
        expect(
          screen.getByRole('button', { name: 'Yorum Gönder' }),
        ).toBeDisabled(),
      );
    });

    it('enables the submit button when the textarea has content', async () => {
      render(<CommentSection {...defaultProps} />);

      await waitFor(() =>
        expect(screen.getByPlaceholderText('Yorum yaz...')).toBeInTheDocument(),
      );

      fireEvent.change(screen.getByPlaceholderText('Yorum yaz...'), {
        target: { value: 'Güzel bir prompt!' },
      });

      expect(
        screen.getByRole('button', { name: 'Yorum Gönder' }),
      ).not.toBeDisabled();
    });

    it('submits a comment, appends it to the list, and clears the textarea', async () => {
      const newComment = buildComment({
        content: 'Yeni yorum metni',
        id: 'comment-new',
      });
      createCommentMock.mockResolvedValue(newComment);

      render(<CommentSection {...defaultProps} />);

      await waitFor(() =>
        expect(screen.getByPlaceholderText('Yorum yaz...')).toBeInTheDocument(),
      );

      fireEvent.change(screen.getByPlaceholderText('Yorum yaz...'), {
        target: { value: 'Yeni yorum metni' },
      });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Yorum Gönder' }));
      });

      await waitFor(() =>
        expect(screen.getByText('Yeni yorum metni')).toBeInTheDocument(),
      );

      expect(createCommentMock).toHaveBeenCalledWith(
        'prompt-1',
        { content: 'Yeni yorum metni' },
        'auth-token',
      );
      expect(screen.getByPlaceholderText('Yorum yaz...')).toHaveValue('');
    });

    it('trims whitespace before submitting a comment', async () => {
      const newComment = buildComment({ content: 'Trimmed content' });
      createCommentMock.mockResolvedValue(newComment);

      render(<CommentSection {...defaultProps} />);

      await waitFor(() =>
        expect(screen.getByPlaceholderText('Yorum yaz...')).toBeInTheDocument(),
      );

      fireEvent.change(screen.getByPlaceholderText('Yorum yaz...'), {
        target: { value: '  Trimmed content  ' },
      });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Yorum Gönder' }));
      });

      expect(createCommentMock).toHaveBeenCalledWith(
        'prompt-1',
        { content: 'Trimmed content' },
        'auth-token',
      );
    });

    it('alerts with the error message when comment creation fails', async () => {
      createCommentMock.mockRejectedValue(new Error('Sunucu hatası'));

      render(<CommentSection {...defaultProps} />);

      await waitFor(() =>
        expect(screen.getByPlaceholderText('Yorum yaz...')).toBeInTheDocument(),
      );

      fireEvent.change(screen.getByPlaceholderText('Yorum yaz...'), {
        target: { value: 'Bir yorum' },
      });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Yorum Gönder' }));
      });

      await waitFor(() =>
        expect(alertMock).toHaveBeenCalledWith('Sunucu hatası'),
      );
    });

    it('alerts with the fallback message when creation fails with a non-Error', async () => {
      createCommentMock.mockRejectedValue('boom');

      render(<CommentSection {...defaultProps} />);

      await waitFor(() =>
        expect(screen.getByPlaceholderText('Yorum yaz...')).toBeInTheDocument(),
      );

      fireEvent.change(screen.getByPlaceholderText('Yorum yaz...'), {
        target: { value: 'Bir yorum' },
      });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Yorum Gönder' }));
      });

      await waitFor(() =>
        expect(alertMock).toHaveBeenCalledWith('Yorum gonderilemedi'),
      );
    });
  });

  describe('comment list display', () => {
    it('shows the empty state when there are no comments', async () => {
      getCommentsMock.mockResolvedValue([]);

      render(<CommentSection {...defaultProps} />);

      await waitFor(() =>
        expect(
          screen.getByText('Henüz yorum yapılmamış. İlk yorumu sen yap!'),
        ).toBeInTheDocument(),
      );
    });

    it('renders loaded comments with username and content', async () => {
      getCommentsMock.mockResolvedValue([
        buildComment({ username: 'ahmet', content: 'Çok işe yaradı!' }),
      ]);

      render(<CommentSection {...defaultProps} />);

      await waitFor(() =>
        expect(screen.getByText('Çok işe yaradı!')).toBeInTheDocument(),
      );

      expect(screen.getByText('@ahmet')).toBeInTheDocument();
    });

    it('shows "anonim" when comment username is null', async () => {
      getCommentsMock.mockResolvedValue([buildComment({ username: null })]);

      render(<CommentSection {...defaultProps} />);

      await waitFor(() =>
        expect(screen.getByText('@anonim')).toBeInTheDocument(),
      );
    });

    it('shows the correct comment count heading from loaded comments', async () => {
      getCommentsMock.mockResolvedValue([
        buildComment({ id: 'c1' }),
        buildComment({ id: 'c2' }),
      ]);

      render(<CommentSection {...defaultProps} initialCommentCount={2} />);

      await waitFor(() =>
        expect(screen.getByText('Yorumlar (2)')).toBeInTheDocument(),
      );
    });

    it('falls back to initialCommentCount in the heading when comments are still loading', async () => {
      // Never resolves during this test
      getCommentsMock.mockReturnValue(new Promise(() => {}));

      render(<CommentSection {...defaultProps} initialCommentCount={5} />);

      // While loading, heading shows initialCommentCount (0 comments loaded yet = uses initialCommentCount)
      expect(screen.getByText('Yorumlar (5)')).toBeInTheDocument();
    });
  });

  describe('comment deletion', () => {
    beforeEach(() => {
      authState.user = { id: 'user-1' };
      authState.token = 'auth-token';
    });

    it('shows a delete button for the comment author', async () => {
      getCommentsMock.mockResolvedValue([buildComment({ user_id: 'user-1' })]);

      render(
        <CommentSection
          promptId="prompt-1"
          promptOwnerId="owner-user"
          initialCommentCount={1}
        />,
      );

      await waitFor(() =>
        expect(screen.getByRole('button', { name: 'Sil' })).toBeInTheDocument(),
      );
    });

    it('shows a delete button for the prompt owner on other users comments', async () => {
      authState.user = { id: 'owner-user' };
      authState.token = 'owner-token';

      getCommentsMock.mockResolvedValue([
        buildComment({ user_id: 'other-user' }),
      ]);

      render(
        <CommentSection
          promptId="prompt-1"
          promptOwnerId="owner-user"
          initialCommentCount={1}
        />,
      );

      await waitFor(() =>
        expect(screen.getByRole('button', { name: 'Sil' })).toBeInTheDocument(),
      );
    });

    it('does not show a delete button for a user who is neither author nor owner', async () => {
      authState.user = { id: 'random-user' };
      authState.token = 'random-token';

      getCommentsMock.mockResolvedValue([buildComment({ user_id: 'user-1' })]);

      render(
        <CommentSection
          promptId="prompt-1"
          promptOwnerId="owner-user"
          initialCommentCount={1}
        />,
      );

      await waitFor(() =>
        expect(screen.getByText('Harika prompt!')).toBeInTheDocument(),
      );

      expect(
        screen.queryByRole('button', { name: 'Sil' }),
      ).not.toBeInTheDocument();
    });

    it('removes the comment from the list after successful deletion', async () => {
      getCommentsMock.mockResolvedValue([
        buildComment({
          id: 'comment-1',
          user_id: 'user-1',
          content: 'Silinecek yorum',
        }),
      ]);
      deleteCommentMock.mockResolvedValue(undefined);

      render(
        <CommentSection
          promptId="prompt-1"
          promptOwnerId="owner-user"
          initialCommentCount={1}
        />,
      );

      await waitFor(() =>
        expect(screen.getByText('Silinecek yorum')).toBeInTheDocument(),
      );

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Sil' }));
      });

      await waitFor(() =>
        expect(screen.queryByText('Silinecek yorum')).not.toBeInTheDocument(),
      );

      expect(deleteCommentMock).toHaveBeenCalledWith(
        'prompt-1',
        'comment-1',
        'auth-token',
      );
    });

    it('alerts with the error message when deletion fails', async () => {
      getCommentsMock.mockResolvedValue([buildComment({ user_id: 'user-1' })]);
      deleteCommentMock.mockRejectedValue(new Error('Silme hatası'));

      render(
        <CommentSection
          promptId="prompt-1"
          promptOwnerId="owner-user"
          initialCommentCount={1}
        />,
      );

      await waitFor(() =>
        expect(screen.getByRole('button', { name: 'Sil' })).toBeInTheDocument(),
      );

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Sil' }));
      });

      await waitFor(() =>
        expect(alertMock).toHaveBeenCalledWith('Silme hatası'),
      );
    });

    it('alerts with fallback message when deletion fails with a non-Error', async () => {
      getCommentsMock.mockResolvedValue([buildComment({ user_id: 'user-1' })]);
      deleteCommentMock.mockRejectedValue('unexpected');

      render(
        <CommentSection
          promptId="prompt-1"
          promptOwnerId="owner-user"
          initialCommentCount={1}
        />,
      );

      await waitFor(() =>
        expect(screen.getByRole('button', { name: 'Sil' })).toBeInTheDocument(),
      );

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Sil' }));
      });

      await waitFor(() =>
        expect(alertMock).toHaveBeenCalledWith('Yorum silinemedi'),
      );
    });
  });

  describe('getComments fetch failure', () => {
    it('stops loading and shows the empty state when fetching comments fails', async () => {
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      getCommentsMock.mockRejectedValue(new Error('network error'));

      render(<CommentSection {...defaultProps} />);

      await waitFor(() =>
        expect(
          screen.getByText('Henüz yorum yapılmamış. İlk yorumu sen yap!'),
        ).toBeInTheDocument(),
      );

      consoleError.mockRestore();
    });
  });
});
