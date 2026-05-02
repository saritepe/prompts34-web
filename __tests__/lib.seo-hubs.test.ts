import { describe, expect, it } from 'vitest';
import {
  GLOSSARY,
  getAllGlossarySlugs,
  getGlossaryBySlug,
  getGlossaryPath,
  getRelatedGlossaryEntries,
} from '@/lib/glossary';
import {
  GUIDES,
  getAllGuideSlugs,
  getGuideBySlug,
  getGuidePath,
} from '@/lib/guides';
import {
  PROFESSIONS,
  getAllProfessionSlugs,
  getProfessionBySlug,
  getProfessionPath,
  matchPromptsForProfession,
} from '@/lib/professions';
import {
  USE_CASES,
  getAllUseCaseSlugs,
  getUseCaseBySlug,
  getUseCasePath,
  matchPromptsForUseCase,
} from '@/lib/use-cases';
import { buildPrompt } from './test-utils/fixtures';

describe('glossary helpers', () => {
  it('exposes slugs, lookup, and path helpers', () => {
    const slugs = getAllGlossarySlugs();
    expect(slugs.length).toBe(GLOSSARY.length);
    expect(new Set(slugs).size).toBe(slugs.length);
    const first = GLOSSARY[0];
    expect(getGlossaryBySlug(first.slug)).toEqual(first);
    expect(getGlossaryBySlug('does-not-exist')).toBeUndefined();
    expect(getGlossaryPath(first)).toBe(`/sozluk/${first.slug}`);
  });

  it('every entry carries SEO-rich metadata', () => {
    for (const entry of GLOSSARY) {
      expect(entry.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(entry.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect((entry.faqs ?? []).length).toBeGreaterThan(0);
    }
  });

  it('related glossary helper falls back to filler entries', () => {
    const promptNedir = getGlossaryBySlug('prompt-nedir')!;
    const related = getRelatedGlossaryEntries(promptNedir, 6);
    expect(related.length).toBe(6);
    expect(related.map((g) => g.slug)).not.toContain(promptNedir.slug);
  });
});

describe('guides helpers', () => {
  it('exposes slugs, lookup, and path helpers', () => {
    const slugs = getAllGuideSlugs();
    expect(slugs.length).toBe(GUIDES.length);
    expect(new Set(slugs).size).toBe(slugs.length);
    const first = GUIDES[0];
    expect(getGuideBySlug(first.slug)).toEqual(first);
    expect(getGuideBySlug('does-not-exist')).toBeUndefined();
    expect(getGuidePath(first)).toBe(`/rehber/${first.slug}`);
    expect(first.steps.length).toBeGreaterThan(0);
  });

  it('every guide carries dates and FAQs', () => {
    for (const guide of GUIDES) {
      expect(guide.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(guide.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect((guide.faqs ?? []).length).toBeGreaterThan(0);
    }
  });
});

describe('professions helpers', () => {
  it('exposes slugs, lookup, path, and prompt matcher', () => {
    const slugs = getAllProfessionSlugs();
    expect(slugs.length).toBe(PROFESSIONS.length);
    const yazilimci = getProfessionBySlug('yazilimci');
    expect(yazilimci).toBeDefined();
    expect(getProfessionBySlug('nope')).toBeUndefined();
    expect(getProfessionPath(yazilimci!)).toBe('/meslek/yazilimci');

    const matchingPrompt = buildPrompt({
      id: 'p-yaz',
      title: 'Kod Üretimi',
      tags: ['yazılım'],
      like_count: 5,
    });
    const otherPrompt = buildPrompt({
      id: 'p-other',
      title: 'CV',
      tags: ['cv'],
    });
    const matched = matchPromptsForProfession(
      [otherPrompt, matchingPrompt],
      yazilimci!,
    );
    expect(matched).toEqual([matchingPrompt]);
  });
});

describe('use-cases helpers', () => {
  it('exposes slugs, lookup, path, and prompt matcher', () => {
    const slugs = getAllUseCaseSlugs();
    expect(slugs.length).toBe(USE_CASES.length);
    const blog = getUseCaseBySlug('blog-yazisi');
    expect(blog).toBeDefined();
    expect(getUseCaseBySlug('nope')).toBeUndefined();
    expect(getUseCasePath(blog!)).toBe('/kullanim/blog-yazisi');

    const matchingPrompt = buildPrompt({
      id: 'p-blog',
      title: 'Blog yazısı',
      tags: ['blog'],
      like_count: 10,
    });
    const recentPrompt = buildPrompt({
      id: 'p-blog-2',
      title: 'SEO blog',
      tags: ['seo'],
      like_count: 10,
      created_at: '2026-04-20T10:00:00.000Z',
    });
    const otherPrompt = buildPrompt({
      id: 'p-other',
      title: 'CV',
      tags: ['cv'],
    });
    const matched = matchPromptsForUseCase(
      [otherPrompt, matchingPrompt, recentPrompt],
      blog!,
    );
    expect(matched.map((p) => p.id)).toEqual(['p-blog-2', 'p-blog']);
  });
});
