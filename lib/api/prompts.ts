import { PromptResponse, PromptCreate, PromptUpdate } from '@/types/prompt';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getPublicPrompts(): Promise<PromptResponse[]> {
  const response = await fetch(`${API_URL}/prompts/public`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch public prompts');
  }

  return response.json();
}

export async function getMyPrompts(token: string): Promise<PromptResponse[]> {
  const response = await fetch(`${API_URL}/prompts/my`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch my prompts');
  }

  return response.json();
}

export async function getPrompt(promptId: string, token?: string): Promise<PromptResponse> {
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/prompts/${promptId}`, {
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch prompt');
  }

  return response.json();
}

export async function createPrompt(data: PromptCreate, token: string): Promise<PromptResponse> {
  const response = await fetch(`${API_URL}/prompts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create prompt');
  }

  return response.json();
}

export async function updatePrompt(promptId: string, data: PromptUpdate, token: string): Promise<PromptResponse> {
  const response = await fetch(`${API_URL}/prompts/${promptId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update prompt');
  }

  return response.json();
}

export async function deletePrompt(promptId: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/prompts/${promptId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete prompt');
  }
}
