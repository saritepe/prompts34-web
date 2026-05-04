import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PromptsPage, { metadata, revalidate } from '@/app/prompts/page';
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

  it('renders all public prompts via the client listing wrapper', async () => {
    const cv = buildPrompt({ id: 'cv-1', title: 'CV Promptu', tags: ['cv'] });
    const logo = buildPrompt({
      id: 'logo-1',
      title: 'Logo Promptu',
      tags: ['logo'],
    });
    getPublicPromptsMock.mockResolvedValueOnce([cv, logo]);

    render(await PromptsPage());

    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(screen.getByText('CV Promptu')).toBeInTheDocument();
    expect(screen.getByText('Logo Promptu')).toBeInTheDocument();
    expect(
      screen.getByText('Tüm herkese açık promptlar listeleniyor.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'CV Promptu' })).toHaveAttribute(
      'href',
      getPromptPath(cv),
    );
  });

  it('exports canonical metadata and ISR revalidate window', () => {
    expect(metadata.alternates?.canonical).toBe(
      'https://prompts34.com/prompts',
    );
    expect(revalidate).toBe(300);
  });
});
