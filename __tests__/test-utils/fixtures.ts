import type {
  PromptCreate,
  PromptResponse,
  PromptUpdate,
  PromptVoteResponse,
} from '@/types/prompt';

export function buildPrompt(
  overrides: Partial<PromptResponse> = {},
): PromptResponse {
  return {
    id: 'prompt-1',
    user_id: 'user-1',
    username: 'test-user',
    title: 'CV Hazirlama Promptu',
    content: 'Detayli bir prompt icerigi',
    tags: ['cv'],
    explanation: 'Aciklama metni',
    suggested_model: 'GPT-4',
    is_public: true,
    like_count: 3,
    liked_by_me: false,
    comment_count: 0,
    created_at: '2026-03-20T10:00:00.000Z',
    updated_at: '2026-03-20T10:00:00.000Z',
    ...overrides,
  };
}

export function buildPromptCreate(
  overrides: Partial<PromptCreate> = {},
): PromptCreate {
  return {
    title: 'Yeni Prompt',
    content: 'Icerik',
    tags: ['etiket-1', 'etiket-2'],
    explanation: 'Aciklama',
    suggested_model: 'Claude',
    is_public: true,
    ...overrides,
  };
}

export function buildPromptUpdate(
  overrides: Partial<PromptUpdate> = {},
): PromptUpdate {
  return {
    title: 'Guncel Baslik',
    content: 'Guncel icerik',
    tags: ['guncel'],
    explanation: 'Guncel aciklama',
    suggested_model: 'Gemini',
    is_public: false,
    ...overrides,
  };
}

export function buildVoteResponse(
  overrides: Partial<PromptVoteResponse> = {},
): PromptVoteResponse {
  return {
    prompt_id: 'prompt-1',
    like_count: 7,
    liked: true,
    ...overrides,
  };
}
