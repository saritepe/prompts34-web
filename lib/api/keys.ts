import { ApiKey, ApiKeyCreatePayload, ApiKeyCreated } from '@/types/apiKey';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

async function jsonOrThrow<T>(
  response: Response,
  fallback: string,
): Promise<T> {
  if (!response.ok) {
    let detail = fallback;
    try {
      const body = await response.json();
      if (body?.detail) detail = body.detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }
  return response.json() as Promise<T>;
}

export async function listApiKeys(token: string): Promise<ApiKey[]> {
  const response = await fetch(`${API_URL}/auth/api-keys`, {
    headers: authHeaders(token),
    cache: 'no-store',
  });
  return jsonOrThrow<ApiKey[]>(response, 'API anahtarları yüklenemedi');
}

export async function createApiKey(
  payload: ApiKeyCreatePayload,
  token: string,
): Promise<ApiKeyCreated> {
  const response = await fetch(`${API_URL}/auth/api-keys`, {
    method: 'POST',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return jsonOrThrow<ApiKeyCreated>(response, 'API anahtarı oluşturulamadı');
}

export async function revokeApiKey(
  keyId: string,
  token: string,
): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/auth/api-keys/${keyId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return jsonOrThrow<{ message: string }>(
    response,
    'API anahtarı iptal edilemedi',
  );
}
