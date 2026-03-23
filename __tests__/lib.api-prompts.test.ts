import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createPrompt,
  deletePrompt,
  getMyPrompts,
  getPrompt,
  getPromptsByTags,
  getPublicPrompts,
  updatePrompt,
  votePrompt,
} from '@/lib/api/prompts';
import {
  buildPrompt,
  buildPromptCreate,
  buildPromptUpdate,
  buildVoteResponse,
} from './test-utils/fixtures';
import { jsonResponse } from './test-utils/network';

describe('lib/api/prompts', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  it('fetches public prompts without auth by default', async () => {
    const prompts = [buildPrompt()];
    fetchMock.mockResolvedValue(jsonResponse(prompts));

    await expect(getPublicPrompts()).resolves.toEqual(prompts);

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/prompts/public',
      {
        headers: {},
        cache: 'no-store',
      },
    );
  });

  it('fetches public prompts with auth when a token is provided', async () => {
    const prompts = [buildPrompt()];
    fetchMock.mockResolvedValue(jsonResponse(prompts));

    await getPublicPrompts('secret-token');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/prompts/public',
      {
        headers: {
          Authorization: 'Bearer secret-token',
        },
        cache: 'no-store',
      },
    );
  });

  it('throws when public prompts cannot be fetched', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ detail: 'nope' }, { status: 500 }),
    );

    await expect(getPublicPrompts()).rejects.toThrow(
      'Failed to fetch public prompts',
    );
  });

  it('fetches prompts by tags', async () => {
    const prompts = [buildPrompt({ tags: ['cv', 'mulakat'] })];
    fetchMock.mockResolvedValue(jsonResponse(prompts));

    await expect(getPromptsByTags(['cv', 'mulakat'])).resolves.toEqual(prompts);

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/prompts/public?tags=cv%2Cmulakat',
      {
        cache: 'no-store',
      },
    );
  });

  it('throws when prompts by tags cannot be fetched', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ detail: 'bad request' }, { status: 400 }),
    );

    await expect(getPromptsByTags(['cv'])).rejects.toThrow(
      'Failed to fetch prompts by tags',
    );
  });

  it('fetches current user prompts', async () => {
    const prompts = [buildPrompt()];
    fetchMock.mockResolvedValue(jsonResponse(prompts));

    await expect(getMyPrompts('token-1')).resolves.toEqual(prompts);

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/prompts/my', {
      headers: {
        Authorization: 'Bearer token-1',
      },
      cache: 'no-store',
    });
  });

  it('throws when current user prompts cannot be fetched', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, { status: 401 }));

    await expect(getMyPrompts('bad-token')).rejects.toThrow(
      'Failed to fetch my prompts',
    );
  });

  it('fetches a prompt detail without auth by default', async () => {
    const prompt = buildPrompt();
    fetchMock.mockResolvedValue(jsonResponse(prompt));

    await expect(getPrompt('prompt-1')).resolves.toEqual(prompt);

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/prompts/prompt-1',
      {
        headers: {},
        cache: 'no-store',
      },
    );
  });

  it('fetches a prompt detail with auth when a token is provided', async () => {
    const prompt = buildPrompt();
    fetchMock.mockResolvedValue(jsonResponse(prompt));

    await getPrompt('prompt-1', 'token-2');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/prompts/prompt-1',
      {
        headers: {
          Authorization: 'Bearer token-2',
        },
        cache: 'no-store',
      },
    );
  });

  it('throws when a prompt detail cannot be fetched', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, { status: 404 }));

    await expect(getPrompt('missing')).rejects.toThrow(
      'Failed to fetch prompt',
    );
  });

  it('creates a prompt', async () => {
    const payload = buildPromptCreate();
    const createdPrompt = buildPrompt({ title: payload.title });
    fetchMock.mockResolvedValue(jsonResponse(createdPrompt));

    await expect(createPrompt(payload, 'token-3')).resolves.toEqual(
      createdPrompt,
    );

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/prompts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-3',
      },
      body: JSON.stringify(payload),
    });
  });

  it('throws when a prompt cannot be created', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, { status: 500 }));

    await expect(createPrompt(buildPromptCreate(), 'token-3')).rejects.toThrow(
      'Failed to create prompt',
    );
  });

  it('updates a prompt', async () => {
    const payload = buildPromptUpdate();
    const updatedPrompt = buildPrompt({
      title: payload.title ?? undefined,
      is_public: payload.is_public ?? true,
    });
    fetchMock.mockResolvedValue(jsonResponse(updatedPrompt));

    await expect(updatePrompt('prompt-1', payload, 'token-4')).resolves.toEqual(
      updatedPrompt,
    );

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/prompts/prompt-1',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token-4',
        },
        body: JSON.stringify(payload),
      },
    );
  });

  it('throws when a prompt cannot be updated', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, { status: 500 }));

    await expect(
      updatePrompt('prompt-1', buildPromptUpdate(), 'token-4'),
    ).rejects.toThrow('Failed to update prompt');
  });

  it('deletes a prompt', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(deletePrompt('prompt-1', 'token-5')).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/prompts/prompt-1',
      {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer token-5',
        },
      },
    );
  });

  it('throws when a prompt cannot be deleted', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, { status: 500 }));

    await expect(deletePrompt('prompt-1', 'token-5')).rejects.toThrow(
      'Failed to delete prompt',
    );
  });

  it('votes for a prompt', async () => {
    const result = buildVoteResponse();
    fetchMock.mockResolvedValue(jsonResponse(result));

    await expect(votePrompt('prompt-1', 'token-6')).resolves.toEqual(result);

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/prompts/prompt-1/vote',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer token-6',
        },
      },
    );
  });

  it('throws the migration-specific vote error when the backend reports the missing table', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        { detail: 'PGRST205 relation prompt_votes does not exist' },
        { status: 500 },
      ),
    );

    await expect(votePrompt('prompt-1', 'token-6')).rejects.toThrow(
      'Oylama henüz aktif değil. Lütfen veritabanı migration adımını tamamlayın.',
    );
  });

  it('throws the backend detail when voting fails for a different reason', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ detail: 'Already voted' }, { status: 400 }),
    );

    await expect(votePrompt('prompt-1', 'token-6')).rejects.toThrow(
      'Already voted',
    );
  });

  it('throws the fallback vote error when the backend provides no detail', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, { status: 400 }));

    await expect(votePrompt('prompt-1', 'token-6')).rejects.toThrow(
      'Failed to vote prompt',
    );
  });

  it('throws the fallback vote error when parsing the error response fails', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: () => Promise.reject(new Error('invalid json')),
    } as Response);

    await expect(votePrompt('prompt-1', 'token-6')).rejects.toThrow(
      'Failed to vote prompt',
    );
  });
});
