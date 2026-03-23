import { CommentResponse, CommentCreate } from '@/types/prompt';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getComments(
  promptId: string,
): Promise<CommentResponse[]> {
  const response = await fetch(`${API_URL}/prompts/${promptId}/comments`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }

  return response.json();
}

export async function createComment(
  promptId: string,
  data: CommentCreate,
  token: string,
): Promise<CommentResponse> {
  const response = await fetch(`${API_URL}/prompts/${promptId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to create comment');
  }

  return response.json();
}

export async function deleteComment(
  promptId: string,
  commentId: string,
  token: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/prompts/${promptId}/comments/${commentId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to delete comment');
  }
}
