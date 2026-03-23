import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Home from '@/app/page';
import { getPublicPrompts, votePrompt } from '@/lib/api/prompts';
import { buildPrompt, buildVoteResponse } from './test-utils/fixtures';
import { routerMock } from './test-utils/next-navigation';
import { createDeferred } from './test-utils/network';
import { alertMock } from '../vitest.setup';

const authState = vi.hoisted(() => ({
  token: 'token-1' as string | null,
  user: {
    email: 'user@example.com',
    username: 'ali',
  } as { email: string; username: string } | null,
}));

vi.mock('@/lib/auth', () => ({
  useAuth: () => authState,
}));

vi.mock('@/components/Navigation', () => ({
  default: () => <nav data-testid="navigation">Navigation</nav>,
}));

vi.mock('@/lib/api/prompts', () => ({
  getPublicPrompts: vi.fn(),
  votePrompt: vi.fn(),
}));

describe('home page', () => {
  const getPublicPromptsMock = vi.mocked(getPublicPrompts);
  const votePromptMock = vi.mocked(votePrompt);

  beforeEach(() => {
    authState.token = 'token-1';
    authState.user = {
      email: 'user@example.com',
      username: 'ali',
    };
    getPublicPromptsMock.mockReset();
    votePromptMock.mockReset();
  });

  it('shows loading skeletons, applies the query-string filter, and supports quick filters', async () => {
    const deferred = createDeferred<ReturnType<typeof buildPrompt>[]>();
    getPublicPromptsMock.mockReturnValueOnce(deferred.promise);
    window.history.pushState({}, '', '/?q=video');

    const { container } = render(<Home />);

    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(8);

    deferred.resolve([
      buildPrompt({
        id: 'video',
        title: 'Video Prompt',
        tags: ['video', 'reel'],
        explanation: null,
        like_count: 4,
        created_at: '2026-03-22T10:00:00.000Z',
      }),
      buildPrompt({
        id: 'visual',
        title: 'Logo Prompt',
        tags: ['logo'],
        username: undefined,
        like_count: 10,
        created_at: '2026-03-21T10:00:00.000Z',
      }),
      buildPrompt({
        id: 'text',
        title: 'Metin Prompt',
        tags: ['analiz'],
        suggested_model: null,
        like_count: 1,
        created_at: '2026-03-20T10:00:00.000Z',
      }),
    ]);

    await waitFor(() =>
      expect(screen.getByDisplayValue('video')).toBeInTheDocument(),
    );

    expect(getPublicPromptsMock).toHaveBeenCalledWith('token-1');
    expect(screen.getAllByText('Video Prompt')).toHaveLength(2);
    expect(screen.queryByText('Logo Prompt')).not.toBeInTheDocument();
    expect(screen.getAllByText('Video')).toHaveLength(2);
    expect(
      screen.getByText('Topluluk tarafından en çok beğenilen promptlar.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Kütüphaneye en son eklenen promptlar.'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Temizle' }));

    await waitFor(() =>
      expect(screen.getAllByText('Logo Prompt')).toHaveLength(2),
    );
    expect(screen.getAllByText('Görsel')).toHaveLength(2);
    expect(screen.getAllByText('Metin')).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: 'logo' }));

    await waitFor(() =>
      expect(screen.queryByText('Video Prompt')).not.toBeInTheDocument(),
    );
    expect(screen.getByDisplayValue('logo')).toBeInTheDocument();
    expect(screen.getAllByText('Logo Prompt')).toHaveLength(2);
  });

  it('renders the empty state when there are no prompts', async () => {
    getPublicPromptsMock.mockResolvedValueOnce([]);

    render(<Home />);

    await waitFor(() =>
      expect(
        screen.getAllByText('Bu bölüm için henüz prompt bulunmuyor.'),
      ).toHaveLength(2),
    );
  });

  it('renders the error state when loading prompts fails', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    getPublicPromptsMock.mockRejectedValueOnce(new Error('boom'));

    render(<Home />);

    await waitFor(() =>
      expect(
        screen.getByText('Promptlar yüklenirken bir hata oluştu'),
      ).toBeInTheDocument(),
    );

    consoleError.mockRestore();
  });

  it('votes for a prompt, updates its count, and stops card navigation', async () => {
    getPublicPromptsMock.mockResolvedValueOnce([
      buildPrompt({
        id: 'vote-target',
        title: 'Oy Verilecek Prompt',
        like_count: 2,
        liked_by_me: false,
      }),
      buildPrompt({
        id: 'vote-other',
        title: 'Diğer Prompt',
        like_count: 1,
      }),
    ]);
    votePromptMock.mockResolvedValueOnce(
      buildVoteResponse({ like_count: 8, liked: true }),
    );

    render(<Home />);

    await waitFor(() =>
      expect(screen.getAllByText('Oy Verilecek Prompt')).toHaveLength(2),
    );

    fireEvent.click(screen.getAllByRole('button', { name: /👍 2/i })[0]!);

    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: /👍 8/i })).toHaveLength(2),
    );
    expect(votePromptMock).toHaveBeenCalledWith('vote-target', 'token-1');
    expect(routerMock.push).not.toHaveBeenCalled();
  });

  it('alerts when logged-out users try to vote', async () => {
    authState.token = null;
    authState.user = null;
    getPublicPromptsMock.mockResolvedValueOnce([
      buildPrompt({ id: 'logged-out-vote', title: 'Giriş Gerekli' }),
    ]);

    render(<Home />);

    await waitFor(() =>
      expect(screen.getAllByText('Giriş Gerekli')).toHaveLength(2),
    );

    expect(
      screen.getByRole('link', { name: 'Ücretsiz Kaydol' }),
    ).toHaveAttribute('href', '/kayit');
    expect(screen.getByRole('link', { name: 'Giriş Yap' })).toHaveAttribute(
      'href',
      '/giris',
    );

    fireEvent.click(screen.getAllByRole('button', { name: /👍 3/i })[0]!);

    expect(alertMock).toHaveBeenCalledWith('Beğenmek için giriş yapmalısınız.');
  });

  // These test the Home page's handleVote wrapper, not the PromptVoteButton component directly.
  // See components.shared.test.tsx for PromptVoteButton-level error handling tests.
  it('shows the fallback vote error for non-Error failures', async () => {
    getPublicPromptsMock.mockResolvedValueOnce([
      buildPrompt({ id: 'vote-error', title: 'Hata Veren Prompt' }),
    ]);
    votePromptMock.mockRejectedValueOnce('boom');

    render(<Home />);

    await waitFor(() =>
      expect(screen.getAllByText('Hata Veren Prompt')).toHaveLength(2),
    );

    fireEvent.click(screen.getAllByRole('button', { name: /👍 3/i })[0]!);

    await waitFor(() =>
      expect(alertMock).toHaveBeenCalledWith('Oylama sırasında hata oluştu'),
    );
  });

  it('shows vote errors from Error instances', async () => {
    getPublicPromptsMock.mockResolvedValueOnce([
      buildPrompt({ id: 'vote-error-2', title: 'Mesajlı Hata Promptu' }),
    ]);
    votePromptMock.mockRejectedValueOnce(new Error('Özel hata'));

    render(<Home />);

    await waitFor(() =>
      expect(screen.getAllByText('Mesajlı Hata Promptu')).toHaveLength(2),
    );

    fireEvent.click(screen.getAllByRole('button', { name: /👍 3/i })[0]!);

    await waitFor(() => expect(alertMock).toHaveBeenCalledWith('Özel hata'));
  });

  it('navigates with a view transition when available and falls back when it throws', async () => {
    getPublicPromptsMock.mockResolvedValueOnce([
      buildPrompt({ id: 'with-transition', title: 'Geçişli Prompt' }),
    ]);

    const startViewTransition = vi.fn((callback: () => void) => callback());
    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: startViewTransition,
    });

    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    try {
      render(<Home />);

      await waitFor(() =>
        expect(screen.getAllByText('Geçişli Prompt')).toHaveLength(2),
      );

      fireEvent.click(
        screen.getAllByText('Geçişli Prompt')[0]!.closest('article')!,
      );

      expect(startViewTransition).toHaveBeenCalledTimes(1);
      expect(routerMock.push).toHaveBeenCalledWith('/prompts/with-transition');

      Object.defineProperty(document, 'startViewTransition', {
        configurable: true,
        value: vi.fn(() => {
          throw new Error('transition failed');
        }),
      });

      fireEvent.click(
        screen.getAllByText('Geçişli Prompt')[0]!.closest('article')!,
      );

      expect(routerMock.push).toHaveBeenCalledWith('/prompts/with-transition');
      expect(consoleError).toHaveBeenCalledWith(
        'View transition failed, fallback navigation applied.',
        expect.any(Error),
      );

      Object.defineProperty(document, 'startViewTransition', {
        configurable: true,
        value: undefined,
      });
      fireEvent.click(
        screen.getAllByText('Geçişli Prompt')[0]!.closest('article')!,
      );

      expect(routerMock.push).toHaveBeenCalledWith('/prompts/with-transition');
    } finally {
      Object.defineProperty(document, 'startViewTransition', {
        configurable: true,
        value: undefined,
      });
      consoleError.mockRestore();
    }
  });

  it('sorts featured prompts by computed score when like counts tie and supports typed search input', async () => {
    getPublicPromptsMock.mockResolvedValueOnce([
      buildPrompt({
        id: 'minimal',
        title: 'Minimal Prompt',
        content: 'Kısa içerik',
        explanation: null,
        suggested_model: null,
        tags: ['analiz'],
        like_count: 5,
        created_at: '2026-01-01T10:00:00.000Z',
      }),
      buildPrompt({
        id: 'detailed',
        title: 'Detaylı Prompt',
        content: 'Uzun içerik '.repeat(50),
        explanation: 'Uzun açıklama',
        suggested_model: 'Claude',
        tags: ['analiz', 'detay', 'uzun', 'zengin'],
        like_count: 5,
        created_at: '2026-03-22T10:00:00.000Z',
      }),
    ]);

    render(<Home />);

    await waitFor(() =>
      expect(screen.getAllByText('Detaylı Prompt')).toHaveLength(2),
    );

    const featuredSection = screen
      .getByRole('heading', { name: 'Öne Çıkan Promptlar' })
      .closest('section')!;
    const featuredHeadings = within(featuredSection).getAllByRole('heading', {
      level: 3,
    });
    expect(featuredHeadings[0]).toHaveTextContent('Detaylı Prompt');
    expect(featuredHeadings[1]).toHaveTextContent('Minimal Prompt');

    fireEvent.change(
      screen.getByPlaceholderText('Başlık, etiket, model veya içerikte ara'),
      {
        target: { value: 'minimal' },
      },
    );

    await waitFor(() =>
      expect(screen.getByDisplayValue('minimal')).toBeInTheDocument(),
    );
    expect(screen.getAllByText('Minimal Prompt')).toHaveLength(2);
    expect(screen.queryByText('Detaylı Prompt')).not.toBeInTheDocument();
  });
});
