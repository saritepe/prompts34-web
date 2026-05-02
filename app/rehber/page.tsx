import { Metadata } from 'next';
import Link from 'next/link';
import {
  sharedOpenGraphImage,
  sharedTwitterImage,
} from '@/app/shared-metadata';
import Navigation from '@/components/Navigation';
import {
  BreadcrumbStructuredData,
  CollectionPageStructuredData,
} from '@/app/components/StructuredData';
import { GUIDES, getGuidePath } from '@/lib/guides';

export const revalidate = false;

const CANONICAL_URL = 'https://prompts34.com/rehber';

export const metadata: Metadata = {
  title: 'Yapay Zeka ve Prompt Rehberleri',
  description:
    'ChatGPT, Gemini, Claude ve Midjourney için Türkçe prompt rehberleri. İyi prompt nasıl yazılır, prompt mühendisliği nedir, hangi tekniklerle başlanır?',
  keywords: [
    'prompt rehberi',
    'chatgpt rehberi',
    'gemini rehberi',
    'midjourney rehberi',
    'prompt mühendisliği rehberi',
    'iyi prompt nasıl yazılır',
  ],
  openGraph: {
    title: 'Yapay Zeka ve Prompt Rehberleri | Prompts34',
    description:
      'ChatGPT, Gemini, Claude ve Midjourney için Türkçe prompt rehberleri.',
    type: 'website',
    url: CANONICAL_URL,
    siteName: 'Prompts34',
    locale: 'tr_TR',
    ...sharedOpenGraphImage,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yapay Zeka ve Prompt Rehberleri | Prompts34',
    description:
      'ChatGPT, Gemini, Claude ve Midjourney için Türkçe prompt rehberleri.',
    ...sharedTwitterImage,
  },
  alternates: { canonical: CANONICAL_URL },
};

export default function RehberHubPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <BreadcrumbStructuredData
        items={[
          { name: 'Ana Sayfa', url: 'https://prompts34.com' },
          { name: 'Rehber', url: CANONICAL_URL },
        ]}
      />
      <CollectionPageStructuredData
        name="Yapay Zeka ve Prompt Rehberleri"
        description="ChatGPT, Gemini, Claude ve Midjourney için Türkçe prompt rehberleri."
        url={CANONICAL_URL}
      />
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Yapay Zeka ve Prompt Rehberleri
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Adım adım anlatımlı, Türkçe yapay zeka prompt rehberleri. ChatGPT,
            Gemini, Claude ve Midjourney&apos;den daha tutarlı çıktı almak için
            pratik teknikler.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={getGuidePath(guide)}
              className="block rounded-lg border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
            >
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                {guide.title}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                {guide.shortDescription}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
