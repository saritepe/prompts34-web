import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SozlukHubPage from '@/app/sozluk/page';
import SozlukDetailPage, {
  generateMetadata as sozlukMetadata,
  generateStaticParams as sozlukParams,
} from '@/app/sozluk/[slug]/page';
import RehberHubPage from '@/app/rehber/page';
import RehberDetailPage, {
  generateMetadata as rehberMetadata,
  generateStaticParams as rehberParams,
} from '@/app/rehber/[slug]/page';
import MeslekHubPage from '@/app/meslek/page';
import MeslekDetailPage, {
  generateMetadata as meslekMetadata,
  generateStaticParams as meslekParams,
} from '@/app/meslek/[slug]/page';
import KullanimHubPage from '@/app/kullanim/page';
import KullanimDetailPage, {
  generateMetadata as kullanimMetadata,
  generateStaticParams as kullanimParams,
} from '@/app/kullanim/[slug]/page';
import { getPublicPrompts } from '@/lib/api/prompts';
import { buildPrompt } from './test-utils/fixtures';

vi.mock('@/components/Navigation', () => ({
  default: () => <nav data-testid="navigation">Navigation</nav>,
}));

vi.mock('@/lib/api/prompts', () => ({
  getPublicPrompts: vi.fn(),
}));

describe('SEO hub pages', () => {
  const getPublicPromptsMock = vi.mocked(getPublicPrompts);

  it('renders the /sozluk hub with all glossary entries', () => {
    render(<SozlukHubPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: /Sözlüğü/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Prompt Nedir/ })).toHaveAttribute(
      'href',
      '/sozluk/prompt-nedir',
    );
  });

  it('renders a /sozluk/[slug] detail page with related entries', async () => {
    const params = Promise.resolve({ slug: 'prompt-nedir' });
    render(await SozlukDetailPage({ params }));
    expect(
      screen.getByRole('heading', { level: 1, name: 'Prompt Nedir?' }),
    ).toBeInTheDocument();

    const meta = await sozlukMetadata({
      params: Promise.resolve({ slug: 'prompt-nedir' }),
    });
    expect(meta.alternates?.canonical).toBe(
      'https://prompts34.com/sozluk/prompt-nedir',
    );

    const emptyMeta = await sozlukMetadata({
      params: Promise.resolve({ slug: 'nope' }),
    });
    expect(emptyMeta).toEqual({});

    const allParams = await sozlukParams();
    expect(allParams.length).toBeGreaterThan(0);
  });

  it('renders the /rehber hub and a guide detail page', async () => {
    render(<RehberHubPage />);
    expect(
      screen.getByRole('link', { name: /İyi Bir Prompt Nasıl Yazılır/ }),
    ).toHaveAttribute('href', '/rehber/iyi-prompt-nasil-yazilir');

    const params = Promise.resolve({ slug: 'iyi-prompt-nasil-yazilir' });
    render(await RehberDetailPage({ params }));
    expect(
      screen.getByRole('heading', { level: 1, name: /İyi Bir Prompt/ }),
    ).toBeInTheDocument();

    const meta = await rehberMetadata({
      params: Promise.resolve({ slug: 'iyi-prompt-nasil-yazilir' }),
    });
    expect(meta.alternates?.canonical).toBe(
      'https://prompts34.com/rehber/iyi-prompt-nasil-yazilir',
    );
    const emptyMeta = await rehberMetadata({
      params: Promise.resolve({ slug: 'nope' }),
    });
    expect(emptyMeta).toEqual({});
    const allParams = await rehberParams();
    expect(allParams.length).toBeGreaterThan(0);
  });

  it('renders the /meslek hub and a profession detail page', async () => {
    getPublicPromptsMock.mockResolvedValueOnce([
      buildPrompt({ id: 'p1', tags: ['yazılım'] }),
    ]);

    render(<MeslekHubPage />);
    expect(
      screen.getByRole('link', { name: /Yazılımcılar İçin/ }),
    ).toHaveAttribute('href', '/meslek/yazilimci');

    const params = Promise.resolve({ slug: 'yazilimci' });
    render(await MeslekDetailPage({ params }));
    expect(
      screen.getByRole('heading', { level: 1, name: /Yazılımcılar/ }),
    ).toBeInTheDocument();

    const meta = await meslekMetadata({
      params: Promise.resolve({ slug: 'yazilimci' }),
    });
    expect(meta.alternates?.canonical).toBe(
      'https://prompts34.com/meslek/yazilimci',
    );
    const emptyMeta = await meslekMetadata({
      params: Promise.resolve({ slug: 'nope' }),
    });
    expect(emptyMeta).toEqual({});
    const allParams = await meslekParams();
    expect(allParams.length).toBeGreaterThan(0);
  });

  it('renders the /meslek detail empty + error states', async () => {
    getPublicPromptsMock.mockRejectedValueOnce(new Error('boom'));
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    try {
      render(
        await MeslekDetailPage({
          params: Promise.resolve({ slug: 'yazilimci' }),
        }),
      );
      expect(
        screen.getByText('Promptlar yüklenirken bir hata oluştu'),
      ).toBeInTheDocument();
    } finally {
      consoleErrorSpy.mockRestore();
    }

    getPublicPromptsMock.mockResolvedValueOnce([]);
    render(
      await MeslekDetailPage({
        params: Promise.resolve({ slug: 'yazilimci' }),
      }),
    );
    expect(
      screen.getByText('Bu meslek için henüz prompt bulunmuyor.'),
    ).toBeInTheDocument();
  });

  it('renders the /kullanim hub and a use-case detail page', async () => {
    getPublicPromptsMock.mockResolvedValueOnce([
      buildPrompt({ id: 'p1', tags: ['blog'] }),
    ]);

    render(<KullanimHubPage />);
    expect(screen.getByRole('link', { name: /Blog Yazısı/ })).toHaveAttribute(
      'href',
      '/kullanim/blog-yazisi',
    );

    const params = Promise.resolve({ slug: 'blog-yazisi' });
    render(await KullanimDetailPage({ params }));
    expect(
      screen.getByRole('heading', { level: 1, name: /Blog Yazısı/ }),
    ).toBeInTheDocument();

    const meta = await kullanimMetadata({
      params: Promise.resolve({ slug: 'blog-yazisi' }),
    });
    expect(meta.alternates?.canonical).toBe(
      'https://prompts34.com/kullanim/blog-yazisi',
    );
    const emptyMeta = await kullanimMetadata({
      params: Promise.resolve({ slug: 'nope' }),
    });
    expect(emptyMeta).toEqual({});
    const allParams = await kullanimParams();
    expect(allParams.length).toBeGreaterThan(0);
  });

  it('renders the /kullanim detail empty + error states', async () => {
    getPublicPromptsMock.mockRejectedValueOnce(new Error('boom'));
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    try {
      render(
        await KullanimDetailPage({
          params: Promise.resolve({ slug: 'blog-yazisi' }),
        }),
      );
      expect(
        screen.getByText('Promptlar yüklenirken bir hata oluştu'),
      ).toBeInTheDocument();
    } finally {
      consoleErrorSpy.mockRestore();
    }

    getPublicPromptsMock.mockResolvedValueOnce([]);
    render(
      await KullanimDetailPage({
        params: Promise.resolve({ slug: 'blog-yazisi' }),
      }),
    );
    expect(
      screen.getByText('Bu kullanım alanı için henüz prompt bulunmuyor.'),
    ).toBeInTheDocument();
  });
});
