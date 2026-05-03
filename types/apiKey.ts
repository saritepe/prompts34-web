export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  expires_at: string | null;
  last_used_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

export interface ApiKeyCreated extends ApiKey {
  key: string;
}

export interface ApiKeyCreatePayload {
  name: string;
  scopes: string[];
  expires_at?: string | null;
}

export const USER_SCOPES = [
  'prompts:read',
  'prompts:write',
  'prompts:delete',
  'comments:write',
  'comments:delete',
  'votes:write',
  'profile:read',
  'profile:write',
  'keys:manage',
] as const;

export const ADMIN_ONLY_SCOPES = [
  'prompts:read:any',
  'prompts:write:any',
  'prompts:delete:any',
  'comments:delete:any',
  'keys:manage:any',
] as const;
