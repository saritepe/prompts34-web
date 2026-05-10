import { describe, expect, it, vi } from 'vitest';
import {
  trackPromptCopy,
  trackPromptLike,
  trackPromptSubmit,
  trackSignUp,
} from '@/lib/analytics';

describe('lib/analytics', () => {
  it('no-ops when window.umami is undefined', () => {
    vi.stubGlobal('umami', undefined);
    expect(() => trackPromptCopy({ promptId: 'p1' })).not.toThrow();
    expect(() => trackPromptLike({ promptId: 'p1' })).not.toThrow();
    expect(() => trackPromptSubmit({ isPublic: true })).not.toThrow();
    expect(() => trackSignUp({ method: 'email' })).not.toThrow();
  });

  it('forwards event name and payload to window.umami.track', () => {
    const track = vi.fn();
    vi.stubGlobal('umami', { track });

    trackPromptCopy({ promptId: 'p1', firstTag: 'cv' });
    trackPromptLike({ promptId: 'p2' });
    trackPromptSubmit({ isPublic: false });
    trackSignUp({ method: 'email' });

    expect(track).toHaveBeenNthCalledWith(1, 'prompt_copy', {
      promptId: 'p1',
      firstTag: 'cv',
    });
    expect(track).toHaveBeenNthCalledWith(2, 'prompt_like', { promptId: 'p2' });
    expect(track).toHaveBeenNthCalledWith(3, 'prompt_submit', {
      isPublic: false,
    });
    expect(track).toHaveBeenNthCalledWith(4, 'sign_up', { method: 'email' });
  });
});
