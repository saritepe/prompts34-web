import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PromptsPage, { generateMetadata } from '@/app/prompts/page';
import { getPublicPrompts } from '@/lib/api/prompts';
import { getPromptPath } from '@/lib/utils/slug';
import { buildPrompt } from './test-utils/fixtures';

vi.mock('@/components/Navigation', () => ({
  default: () => <nav data-testid="navigation">Navigation</nav>,
}));

vi.mock('@/lib/api/prompts', () => ({
  getPublicPrompts: vi.fn(),
}));

describe('prompts listing page', () => {
  const getPublicPromptsMock = vi.mocked(getPublicPrompts);

  it('filters prompts by q search param and links to prompt detail pages', async () => {
    getPublicPromptsMock.mockResolvedValueOnce([
      buildPrompt({ id: 'cv-1', title: 'CV Promptu', tags: ['cv'] }),
      buildPrompt({ id: 'logo-1', title: 'Logo Promptu', tags: ['logo'] }),
    ]);

    render(
      await PromptsPage({
        searchParams: Promise.resolve({ q: 'cv' }),
      }),
    );

    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(
      screen.getByText('"cv" aramasıyla eşleşen promptlar listeleniyor.'),
    ).toBeInTheDocument();
    expect(screen.getByText('CV Promptu')).toBeInTheDocument();
    expect(screen.queryByText('Logo Promptu')).not.toBeInTheDocument();
    const cvPrompt = buildPrompt({
      id: 'cv-1',
      title: 'CV Promptu',
      tags: ['cv'],
    });
    expect(screen.getByRole('link', { name: 'CV Promptu' })).toHaveAttribute(
      'href',
      getPromptPath(cvPrompt),
    );
  });

  it('exports canonical metadata for the listing page', async () => {
    const meta = await generateMetadata({});
    expect(meta.alternates?.canonical).toBe('https://prompts34.com/prompts');
  });

  it('noindexes search result pages when a query is active', async () => {
    const meta = await generateMetadata({
      searchParams: Promise.resolve({ q: 'cv' }),
    });
    expect(meta.robots).toEqual({ index: false, follow: false });
  });
});
