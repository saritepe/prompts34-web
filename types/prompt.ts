export type PromptOutput =
  | { type: 'text'; value: string }
  | { type: 'image'; value: string };

export interface PromptResponse {
  id: string;
  user_id: string;
  username?: string; // Optional for backwards compatibility
  title: string;
  content: string;
  tags: string[];
  explanation: string | null;
  suggested_model: string | null;
  is_public: boolean;
  output: PromptOutput | null;
  like_count: number;
  liked_by_me: boolean;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

export interface PromptVoteResponse {
  prompt_id: string;
  like_count: number;
  liked: boolean;
}

export interface PromptCreate {
  title: string;
  content: string;
  tags?: string[];
  explanation?: string | null;
  suggested_model?: string | null;
  is_public?: boolean;
  output?: PromptOutput | null;
}

export interface PromptUpdate {
  title?: string | null;
  content?: string | null;
  tags?: string[] | null;
  explanation?: string | null;
  suggested_model?: string | null;
  is_public?: boolean | null;
  output?: PromptOutput | null;
}

export interface CommentResponse {
  id: string;
  prompt_id: string;
  user_id: string;
  username: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CommentCreate {
  content: string;
}
