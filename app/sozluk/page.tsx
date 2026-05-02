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
import { GLOSSARY, getGlossaryPath } from '@/lib/glossary';

export const revalidate = false;

const CANONICAL_URL = 'https://prompts34.com/sozluk';

export const metadata: Metadata = {
  title: 'Yapay Zeka ve Prompt Sözlüğü',
  description:
    'Yapay zeka ve prompt mühendisliği terimleri sözlüğü. Prompt nedir, few-shot, chain-of-thought, RAG, temperature, embedding ve daha fazlasının Türkçe açıklaması.',
  keywords: [
    'prompt sözlük',
    'yapay zeka sözlük',
    'prompt nedir',
    'prompt ne demek',
    'prompt mühendisliği nedir',
    'ai terimleri',
  ],
  openGraph: {
    title: 'Yapay Zeka ve Prompt Sözlüğü | Prompts34',
    description:
      'Prompt mühendisliği ve yapay zeka terimleri sözlüğü. Türkçe açıklamalar.',
    type: 'website',
    url: CANONICAL_URL,
    siteName: 'Prompts34',
    locale: 'tr_TR',
    ...sharedOpenGraphImage,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yapay Zeka ve Prompt Sözlüğü | Prompts34',
    description:
      'Prompt mühendisliği ve yapay zeka terimleri sözlüğü. Türkçe açıklamalar.',
    ...sharedTwitterImage,
  },
  alternates: {
    canonical: CANONICAL_URL,
  },
};

export default function SozlukHubPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <BreadcrumbStructuredData
        items={[
          { name: 'Ana Sayfa', url: 'https://prompts34.com' },
          { name: 'Sözlük', url: CANONICAL_URL },
        ]}
      />
      <CollectionPageStructuredData
        name="Yapay Zeka ve Prompt Sözlüğü"
        description="Prompt mühendisliği ve yapay zeka terimleri sözlüğü."
        url={CANONICAL_URL}
      />
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Yapay Zeka ve Prompt Sözlüğü
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Prompt mühendisliği ve yapay zeka dünyasındaki temel terimlerin
            kısa, anlaşılır Türkçe açıklamaları. Her terim için detaylı içerik
            ve ilgili promptlara hızlıca ulaşabilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GLOSSARY.map((entry) => (
            <Link
              key={entry.slug}
              href={getGlossaryPath(entry)}
              className="block rounded-lg border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
            >
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                {entry.term}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                {entry.shortDefinition}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
