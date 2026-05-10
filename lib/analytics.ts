type CopyPayload = { promptId: string; firstTag?: string };
type LikePayload = { promptId: string };
type SubmitPayload = { isPublic: boolean };
type SignUpPayload = { method: 'email' };

function send(event: string, data?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || !window.umami) return;
  window.umami.track(event, data);
}

export function trackPromptCopy(payload: CopyPayload): void {
  send('prompt_copy', payload);
}

export function trackPromptLike(payload: LikePayload): void {
  send('prompt_like', payload);
}

export function trackPromptSubmit(payload: SubmitPayload): void {
  send('prompt_submit', payload);
}

export function trackSignUp(payload: SignUpPayload): void {
  send('sign_up', payload);
}
