import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getComments, createComment, deleteComment } from '@/lib/api/comments';
import { jsonResponse } from './test-utils/network';
import type { CommentResponse } from '@/types/prompt';

function buildComment(
  overrides: Partial<CommentResponse> = {},
): CommentResponse {
  return {
    id: 'comment-1',
    prompt_id: 'prompt-1',
    user_id: 'user-1',
    username: 'test-user',
    content: 'Test yorum icerigi',
    created_at: '2026-03-24T00:00:00.000Z',
    updated_at: '2026-03-24T00:00:00.000Z',
    ...overrides,
  };
}

describe('lib/api/comments', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  describe('getComments', () => {
    it('fetches comments for a prompt', async () => {
      const comments = [buildComment()];
      fetchMock.mockResolvedValue(jsonResponse(comments));

      await expect(getComments('prompt-1')).resolves.toEqual(comments);

      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:8000/prompts/prompt-1/comments',
        { cache: 'no-store' },
      );
    });

    it('returns an empty array for a prompt with no comments', async () => {
      fetchMock.mockResolvedValue(jsonResponse([]));

      await expect(getComments('prompt-1')).resolves.toEqual([]);
    });

    it('throws when fetching comments fails', async () => {
      fetchMock.mockResolvedValue(
        jsonResponse({ detail: 'not found' }, { status: 404 }),
      );

      await expect(getComments('missing-prompt')).rejects.toThrow(
        'Failed to fetch comments',
      );
    });

    it('returns comments with null username for deleted users', async () => {
      const comments = [buildComment({ username: null })];
      fetchMock.mockResolvedValue(jsonResponse(comments));

      const result = await getComments('prompt-1');
      expect(result[0].username).toBeNull();
    });
  });

  describe('createComment', () => {
    it('posts a comment with auth header and returns the created comment', async () => {
      const comment = buildComment({ content: 'Yeni yorum' });
      fetchMock.mockResolvedValue(jsonResponse(comment, { status: 201 }));

      await expect(
        createComment('prompt-1', { content: 'Yeni yorum' }, 'my-token'),
      ).resolves.toEqual(comment);

      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:8000/prompts/prompt-1/comments',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer my-token',
          },
          body: JSON.stringify({ content: 'Yeni yorum' }),
        },
      );
    });

    it('throws the backend detail when creation fails', async () => {
      fetchMock.mockResolvedValue(
        jsonResponse(
          { detail: 'Can only comment on public prompts' },
          { status: 403 },
        ),
      );

      await expect(
        createComment('prompt-1', { content: 'test' }, 'token'),
      ).rejects.toThrow('Can only comment on public prompts');
    });

    it('throws fallback error when creation fails without a detail field', async () => {
      fetchMock.mockResolvedValue(jsonResponse({}, { status: 500 }));

      await expect(
        createComment('prompt-1', { content: 'test' }, 'token'),
      ).rejects.toThrow('Failed to create comment');
    });

    it('throws fallback error when response JSON parsing fails on error', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        json: () => Promise.reject(new Error('invalid json')),
      } as Response);

      await expect(
        createComment('prompt-1', { content: 'test' }, 'token'),
      ).rejects.toThrow('Failed to create comment');
    });

    it('throws 401 detail when posting without auth', async () => {
      fetchMock.mockResolvedValue(
        jsonResponse({ detail: 'Not authenticated' }, { status: 401 }),
      );

      await expect(
        createComment('prompt-1', { content: 'test' }, 'bad-token'),
      ).rejects.toThrow('Not authenticated');
    });
  });

  describe('deleteComment', () => {
    it('deletes a comment and resolves void', async () => {
      fetchMock.mockResolvedValue(
        new Response(
          JSON.stringify({ message: 'Comment deleted successfully' }),
          { status: 200 },
        ),
      );

      await expect(
        deleteComment('prompt-1', 'comment-1', 'my-token'),
      ).resolves.toBeUndefined();

      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:8000/prompts/prompt-1/comments/comment-1',
        {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer my-token',
          },
        },
      );
    });

    it('throws the backend detail when deletion is forbidden', async () => {
      fetchMock.mockResolvedValue(
        jsonResponse(
          { detail: "You don't have permission to delete this comment" },
          { status: 403 },
        ),
      );

      await expect(
        deleteComment('prompt-1', 'comment-1', 'other-token'),
      ).rejects.toThrow("You don't have permission to delete this comment");
    });

    it('throws when comment is not found', async () => {
      fetchMock.mockResolvedValue(
        jsonResponse({ detail: 'Comment not found' }, { status: 404 }),
      );

      await expect(
        deleteComment('prompt-1', 'missing-comment', 'token'),
      ).rejects.toThrow('Comment not found');
    });

    it('throws fallback error when deletion fails without a detail field', async () => {
      fetchMock.mockResolvedValue(jsonResponse({}, { status: 500 }));

      await expect(
        deleteComment('prompt-1', 'comment-1', 'token'),
      ).rejects.toThrow('Failed to delete comment');
    });

    it('throws fallback error when JSON parsing fails on error response', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        json: () => Promise.reject(new Error('bad json')),
      } as Response);

      await expect(
        deleteComment('prompt-1', 'comment-1', 'token'),
      ).rejects.toThrow('Failed to delete comment');
    });
  });
});
