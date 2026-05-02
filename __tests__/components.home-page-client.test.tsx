import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import HomePageClient from '@/components/HomePageClient';
import { getPublicPrompts, votePrompt } from '@/lib/api/prompts';
import { buildPrompt, buildVoteResponse } from './test-utils/fixtures';
import {
  resetNextNavigationMock,
  routerMock,
} from './test-utils/next-navigation';
import { alertMock } from '../vitest.setup';

const authState = vi.hoisted(() => ({
  token: null as string | null,
  user: null as { email: string; username: string } | null,
  loading: false,
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

describe('HomePageClient', () => {
  const getPublicPromptsMock = vi.mocked(getPublicPrompts);
  const votePromptMock = vi.mocked(votePrompt);

  beforeEach(() => {
    authState.token = null;
    authState.user = null;
    authState.loading = false;
    getPublicPromptsMock.mockReset();
    votePromptMock.mockReset();
    resetNextNavigationMock();
  });

  it('seeds the search query from the server and supports quick filters', () => {
    render(
      <HomePageClient
        initialPrompts={[
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
        ]}
        initialSearch="video"
        initialLoadError={null}
      />,
    );

    expect(screen.getByDisplayValue('video')).toBeInTheDocument();
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

    expect(screen.getAllByText('Logo Prompt')).toHaveLength(2);
    expect(screen.getAllByText('Görsel')).toHaveLength(2);
    expect(screen.getAllByText('Metin')).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: 'logo' }));

    expect(screen.getByDisplayValue('logo')).toBeInTheDocument();
    expect(screen.getAllByText('Logo Prompt')).toHaveLength(2);
    expect(screen.queryByText('Video Prompt')).not.toBeInTheDocument();
  });

  it('renders the empty state when there are no prompts', () => {
    render(
      <HomePageClient
        initialPrompts={[]}
        initialSearch=""
        initialLoadError={null}
      />,
    );

    expect(
      screen.getAllByText('Bu bölüm için henüz prompt bulunmuyor.'),
    ).toHaveLength(2);
  });

  it('renders the initial error state from the server page', () => {
    render(
      <HomePageClient
        initialPrompts={[]}
        initialSearch=""
        initialLoadError="Promptlar yüklenirken bir hata oluştu"
      />,
    );

    expect(
      screen.getByText('Promptlar yüklenirken bir hata oluştu'),
    ).toBeInTheDocument();
  });

  it('refreshes prompts after hydration when an auth token is available', async () => {
    authState.token = 'token-1';
    authState.user = {
      email: 'user@example.com',
      username: 'ali',
    };
    getPublicPromptsMock.mockResolvedValueOnce([
      buildPrompt({
        id: 'refreshed',
        title: 'Yenilenen Prompt',
        liked_by_me: true,
        like_count: 12,
      }),
    ]);

    render(
      <HomePageClient
        initialPrompts={[buildPrompt({ id: 'initial', title: 'İlk Prompt' })]}
        initialSearch=""
        initialLoadError={null}
      />,
    );

    expect(screen.getAllByText('İlk Prompt')).toHaveLength(2);

    await waitFor(() =>
      expect(screen.getAllByText('Yenilenen Prompt')).toHaveLength(2),
    );
    expect(getPublicPromptsMock).toHaveBeenCalledWith('token-1');
  });

  it('keeps the server-rendered prompts visible when the auth refresh fails', async () => {
    authState.token = 'token-1';
    authState.user = {
      email: 'user@example.com',
      username: 'ali',
    };
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    getPublicPromptsMock.mockRejectedValueOnce(new Error('boom'));

    render(
      <HomePageClient
        initialPrompts={[
          buildPrompt({ id: 'stale', title: 'Sunucuda Gelen Prompt' }),
        ]}
        initialSearch=""
        initialLoadError={null}
      />,
    );

    await waitFor(() =>
      expect(getPublicPromptsMock).toHaveBeenCalledWith('token-1'),
    );
    expect(screen.getAllByText('Sunucuda Gelen Prompt')).toHaveLength(2);
    expect(
      screen.queryByText('Promptlar yüklenirken bir hata oluştu'),
    ).not.toBeInTheDocument();
    expect(consoleError).toHaveBeenCalledWith(
      'Failed to refresh homepage prompts for authenticated user.',
      expect.any(Error),
    );

    consoleError.mockRestore();
  });

  it('votes for a prompt, updates its count, and stops card navigation', async () => {
    authState.token = 'token-1';
    authState.user = {
      email: 'user@example.com',
      username: 'ali',
    };
    authState.loading = true;
    votePromptMock.mockResolvedValueOnce(
      buildVoteResponse({ like_count: 8, liked: true }),
    );

    render(
      <HomePageClient
        initialPrompts={[
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
        ]}
        initialSearch=""
        initialLoadError={null}
      />,
    );

    fireEvent.click(screen.getAllByRole('button', { name: /👍 2/i })[0]!);

    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: /👍 8/i })).toHaveLength(2),
    );
    expect(votePromptMock).toHaveBeenCalledWith('vote-target', 'token-1');
  });

  it('alerts when logged-out users try to vote', () => {
    render(
      <HomePageClient
        initialPrompts={[
          buildPrompt({ id: 'logged-out-vote', title: 'Giriş Gerekli' }),
        ]}
        initialSearch=""
        initialLoadError={null}
      />,
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

  it('shows the fallback vote error for non-Error failures', async () => {
    authState.token = 'token-1';
    authState.user = {
      email: 'user@example.com',
      username: 'ali',
    };
    authState.loading = true;
    votePromptMock.mockRejectedValueOnce('boom');

    render(
      <HomePageClient
        initialPrompts={[
          buildPrompt({ id: 'vote-error', title: 'Hata Veren Prompt' }),
        ]}
        initialSearch=""
        initialLoadError={null}
      />,
    );

    fireEvent.click(screen.getAllByRole('button', { name: /👍 3/i })[0]!);

    await waitFor(() =>
      expect(alertMock).toHaveBeenCalledWith('Oylama sırasında hata oluştu'),
    );
  });

  it('shows vote errors from Error instances', async () => {
    authState.token = 'token-1';
    authState.user = {
      email: 'user@example.com',
      username: 'ali',
    };
    authState.loading = true;
    votePromptMock.mockRejectedValueOnce(new Error('Özel hata'));

    render(
      <HomePageClient
        initialPrompts={[
          buildPrompt({ id: 'vote-error-2', title: 'Mesajlı Hata Promptu' }),
        ]}
        initialSearch=""
        initialLoadError={null}
      />,
    );

    fireEvent.click(screen.getAllByRole('button', { name: /👍 3/i })[0]!);

    await waitFor(() => expect(alertMock).toHaveBeenCalledWith('Özel hata'));
  });

  it('renders crawlable prompt links on the homepage cards', () => {
    render(
      <HomePageClient
        initialPrompts={[
          buildPrompt({ id: 'linked-prompt', title: 'Bağlantılı Prompt' }),
        ]}
        initialSearch=""
        initialLoadError={null}
      />,
    );

    const promptLinks = screen.getAllByRole('link', {
      name: 'Bağlantılı Prompt',
    });

    expect(promptLinks).toHaveLength(2);
    expect(promptLinks[0]).toHaveAttribute('href', '/prompts/linked-prompt');
    expect(promptLinks[1]).toHaveAttribute('href', '/prompts/linked-prompt');
  });

  it('sorts featured prompts by computed score when like counts tie and supports typed search input', () => {
    render(
      <HomePageClient
        initialPrompts={[
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
        ]}
        initialSearch=""
        initialLoadError={null}
      />,
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

    expect(screen.getByDisplayValue('minimal')).toBeInTheDocument();
    expect(screen.getAllByText('Minimal Prompt')).toHaveLength(2);
    expect(screen.queryByText('Detaylı Prompt')).not.toBeInTheDocument();
  });

  it('routes exact topic keyword searches to canonical topic pages', () => {
    render(
      <HomePageClient
        initialPrompts={[]}
        initialSearch=""
        initialLoadError={null}
      />,
    );

    fireEvent.change(
      screen.getByPlaceholderText('Başlık, etiket, model veya içerikte ara'),
      {
        target: { value: 'cv' },
      },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Promptları Keşfet' }));

    expect(routerMock.push).toHaveBeenCalledWith('/kategori/cv-hazirlama');
  });

  it('routes Turkish-normalized topic searches to canonical topic pages', () => {
    render(
      <HomePageClient
        initialPrompts={[]}
        initialSearch=""
        initialLoadError={null}
      />,
    );

    fireEvent.change(
      screen.getByPlaceholderText('Başlık, etiket, model veya içerikte ara'),
      {
        target: { value: 'özgeçmiş' },
      },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Promptları Keşfet' }));

    expect(routerMock.push).toHaveBeenCalledWith('/kategori/cv-hazirlama');
  });

  it('routes unknown searches to the prompt listing query page', () => {
    render(
      <HomePageClient
        initialPrompts={[]}
        initialSearch=""
        initialLoadError={null}
      />,
    );

    fireEvent.change(
      screen.getByPlaceholderText('Başlık, etiket, model veya içerikte ara'),
      {
        target: { value: 'unknown' },
      },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Promptları Keşfet' }));

    expect(routerMock.push).toHaveBeenCalledWith('/prompts?q=unknown');
  });
});
