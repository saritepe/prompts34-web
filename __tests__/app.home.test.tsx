import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Home, { dynamic as homeDynamic } from '@/app/page';
import { getPublicPrompts } from '@/lib/api/prompts';
import type { PromptResponse } from '@/types/prompt';
import { buildPrompt } from './test-utils/fixtures';

vi.mock('@/lib/api/prompts', () => ({
  getPublicPrompts: vi.fn(),
}));

vi.mock('@/components/HomePageClient', () => ({
  default: ({
    initialPrompts,
    initialSearch,
    initialLoadError,
  }: {
    initialPrompts: PromptResponse[];
    initialSearch: string;
    initialLoadError: string | null;
  }) => (
    <div>
      <div data-testid="initial-search">{initialSearch}</div>
      <div data-testid="initial-error">{initialLoadError ?? ''}</div>
      {initialPrompts.map((prompt) => (
        <article key={prompt.id}>
          <h2>{prompt.title}</h2>
          <p>{prompt.content}</p>
        </article>
      ))}
    </div>
  ),
}));

describe('home page', () => {
  const getPublicPromptsMock = vi.mocked(getPublicPrompts);

  beforeEach(() => {
    getPublicPromptsMock.mockReset();
  });

  it('exports dynamic rendering and passes server-fetched prompt content to the client component', async () => {
    getPublicPromptsMock.mockResolvedValueOnce([
      buildPrompt({
        id: 'video',
        title: 'Video Prompt',
        content: 'Sunucudan gelen prompt içeriği',
      }),
    ]);

    render(
      await Home({
        searchParams: Promise.resolve({ q: 'video' }),
      }),
    );

    expect(homeDynamic).toBe('force-dynamic');
    expect(getPublicPromptsMock).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('initial-search')).toHaveTextContent('video');
    expect(screen.getByText('Video Prompt')).toBeInTheDocument();
    expect(
      screen.getByText('Sunucudan gelen prompt içeriği'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('initial-error')).toBeEmptyDOMElement();
  });

  it('uses the first search query value when q is provided as an array', async () => {
    getPublicPromptsMock.mockResolvedValueOnce([]);

    render(
      await Home({
        searchParams: Promise.resolve({ q: ['logo', 'video'] }),
      }),
    );

    expect(screen.getByTestId('initial-search')).toHaveTextContent('logo');
  });

  it('passes an empty prompt list when no prompts are returned', async () => {
    getPublicPromptsMock.mockResolvedValueOnce([]);

    render(await Home({}));

    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    expect(screen.getByTestId('initial-error')).toBeEmptyDOMElement();
  });

  it('passes the server error message when fetching prompts fails', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    getPublicPromptsMock.mockRejectedValueOnce(new Error('boom'));

    render(await Home({}));

    expect(screen.getByTestId('initial-error')).toHaveTextContent(
      'Promptlar yüklenirken bir hata oluştu',
    );
    expect(consoleError).toHaveBeenCalledWith(
      'Failed to fetch homepage prompts.',
      expect.any(Error),
    );

    consoleError.mockRestore();
  });
});
