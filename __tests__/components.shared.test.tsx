import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CopyContentButton from '@/components/CopyContentButton';
import Footer from '@/components/Footer';
import PromptVoteButton from '@/components/PromptVoteButton';
import {
  BreadcrumbStructuredData,
  CollectionPageStructuredData,
  WebSiteStructuredData,
} from '@/app/components/StructuredData';
import { votePrompt } from '@/lib/api/prompts';
import { buildVoteResponse } from './test-utils/fixtures';
import { createDeferred } from './test-utils/network';
import { alertMock, writeText } from '../vitest.setup';

const authState = vi.hoisted(() => ({
  token: 'token-1' as string | null,
}));

vi.mock('@/lib/auth', () => ({
  useAuth: () => authState,
}));

vi.mock('@/lib/api/prompts', () => ({
  votePrompt: vi.fn(),
}));

describe('shared frontend components', () => {
  const votePromptMock = vi.mocked(votePrompt);

  beforeEach(() => {
    authState.token = 'token-1';
    votePromptMock.mockReset();
  });

  it('renders the footer with the current year and CTA link', () => {
    render(<Footer />);

    expect(screen.getByText('Prompts34')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Topluluğa Katıl' }),
    ).toHaveAttribute('href', '/kayit');
    expect(
      screen.getByText(new RegExp(String(new Date().getFullYear()))),
    ).toBeInTheDocument();
  });

  it('renders all structured data variants with JSON payloads', () => {
    const { container, rerender } = render(<WebSiteStructuredData />);
    let script = container.querySelector('script');
    expect(script?.textContent).toContain('"@type":"WebSite"');

    rerender(
      <BreadcrumbStructuredData
        items={[
          { name: 'Ana Sayfa', url: 'https://prompts34.com' },
          { name: 'CV', url: 'https://prompts34.com/cv-hazirlama' },
        ]}
      />,
    );
    script = container.querySelector('script');
    expect(script?.textContent).toContain('"@type":"BreadcrumbList"');
    expect(script?.textContent).toContain('"position":2');

    rerender(
      <CollectionPageStructuredData
        name="CV Hazırlama Promptları"
        description="CV sayfası"
        url="https://prompts34.com/cv-hazirlama"
      />,
    );
    script = container.querySelector('script');
    expect(script?.textContent).toContain('"@type":"CollectionPage"');
    expect(script?.textContent).toContain('"inLanguage":"tr-TR"');
  });

  it('copies prompt content and resets the label after a delay', async () => {
    vi.useFakeTimers();
    writeText.mockResolvedValue(undefined);

    render(<CopyContentButton content="kopyalanacak içerik" />);

    const button = screen.getByRole('button', { name: 'İçeriği kopyala' });
    await act(async () => {
      fireEvent.click(button);
      await Promise.resolve();
    });

    expect(writeText).toHaveBeenCalledWith('kopyalanacak içerik');
    expect(button).toHaveAttribute('title', 'Kopyalandı');

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(button).toHaveAttribute('title', 'Kopyala');

    vi.useRealTimers();
  });

  it('fires the prompt_copy umami event when promptId is provided', async () => {
    const track = vi.fn();
    vi.stubGlobal('umami', { track });
    writeText.mockResolvedValue(undefined);

    render(
      <CopyContentButton
        content="izlenecek içerik"
        promptId="prompt-42"
        firstTag="cv"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'İçeriği kopyala' }));

    await waitFor(() =>
      expect(track).toHaveBeenCalledWith('prompt_copy', {
        promptId: 'prompt-42',
        firstTag: 'cv',
      }),
    );
  });

  it('skips the prompt_copy umami event when promptId is missing', async () => {
    const track = vi.fn();
    vi.stubGlobal('umami', { track });
    writeText.mockResolvedValue(undefined);

    render(<CopyContentButton content="anonim kopya" />);

    fireEvent.click(screen.getByRole('button', { name: 'İçeriği kopyala' }));

    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(track).not.toHaveBeenCalled();
  });

  it('fires the prompt_like umami event after a successful vote', async () => {
    authState.token = 'token-1';
    const track = vi.fn();
    vi.stubGlobal('umami', { track });
    votePromptMock.mockResolvedValue(
      buildVoteResponse({ like_count: 3, liked: true }),
    );

    render(
      <PromptVoteButton
        promptId="prompt-9"
        initialLikeCount={2}
        initialLikedByMe={false}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Promptu beğen' }));

    await waitFor(() =>
      expect(track).toHaveBeenCalledWith('prompt_like', {
        promptId: 'prompt-9',
      }),
    );
  });

  it('does not fire prompt_like when the vote toggles to unliked', async () => {
    authState.token = 'token-1';
    const track = vi.fn();
    vi.stubGlobal('umami', { track });
    votePromptMock.mockResolvedValue(
      buildVoteResponse({ like_count: 2, liked: false }),
    );

    render(
      <PromptVoteButton
        promptId="prompt-9"
        initialLikeCount={3}
        initialLikedByMe={true}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Promptu beğen' }));

    await waitFor(() => expect(votePromptMock).toHaveBeenCalled());
    expect(track).not.toHaveBeenCalled();
  });

  it('logs copy failures without crashing', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    writeText.mockRejectedValue(new Error('clipboard failed'));

    render(<CopyContentButton content="başarısız kopya" />);

    fireEvent.click(screen.getByRole('button', { name: 'İçeriği kopyala' }));

    await waitFor(() =>
      expect(consoleError).toHaveBeenCalledWith(
        'İçerik kopyalanamadı',
        expect.any(Error),
      ),
    );

    consoleError.mockRestore();
  });

  it('alerts when unauthenticated users try to vote', () => {
    authState.token = null;

    render(
      <PromptVoteButton
        promptId="prompt-1"
        initialLikeCount={2}
        initialLikedByMe={false}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Promptu beğen' }));

    expect(alertMock).toHaveBeenCalledWith('Beğenmek için giriş yapmalısınız.');
  });

  it('votes successfully, updates the count, and ignores repeat clicks while pending', async () => {
    authState.token = 'token-1';
    const deferred = createDeferred<ReturnType<typeof buildVoteResponse>>();
    votePromptMock.mockReturnValueOnce(deferred.promise);

    render(
      <PromptVoteButton
        promptId="prompt-1"
        initialLikeCount={2}
        initialLikedByMe={false}
      />,
    );

    const button = screen.getByRole('button', { name: 'Promptu beğen' });
    fireEvent.click(button);
    await waitFor(() => expect(button).toBeDisabled());
    button.removeAttribute('disabled');
    fireEvent.click(button);

    expect(votePromptMock).toHaveBeenCalledTimes(1);

    deferred.resolve(buildVoteResponse({ like_count: 8, liked: true }));

    await waitFor(() => expect(button).toHaveTextContent('👍 8'));
  });

  it('shows the fallback vote error for non-Error rejections', async () => {
    authState.token = 'token-1';
    votePromptMock.mockRejectedValue('boom');

    render(
      <PromptVoteButton
        promptId="prompt-1"
        initialLikeCount={4}
        initialLikedByMe={true}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Promptu beğen' }));

    await waitFor(() =>
      expect(alertMock).toHaveBeenCalledWith('Oylama sırasında hata oluştu'),
    );
  });

  it('shows vote errors from Error instances', async () => {
    authState.token = 'token-1';
    votePromptMock.mockRejectedValue(new Error('Özel oy hatası'));

    render(
      <PromptVoteButton
        promptId="prompt-1"
        initialLikeCount={4}
        initialLikedByMe={false}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Promptu beğen' }));

    await waitFor(() =>
      expect(alertMock).toHaveBeenCalledWith('Özel oy hatası'),
    );
  });
});
