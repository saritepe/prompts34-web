export interface PromptResponse {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  explanation: string | null;
  suggested_model: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface PromptCreate {
  title: string;
  content: string;
  tags?: string[];
  explanation?: string | null;
  suggested_model?: string | null;
  is_public?: boolean;
}

export interface PromptUpdate {
  title?: string | null;
  content?: string | null;
  tags?: string[] | null;
  explanation?: string | null;
  suggested_model?: string | null;
  is_public?: boolean | null;
}
