import type { Metadata } from 'next';
import { Suspense } from 'react';
import Navigation from '@/components/Navigation';
import PromptsListingClient from '@/components/PromptsListingClient';
import { getPublicPrompts } from '@/lib/api/prompts';
import type { PromptResponse } from '@/types/prompt';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Prompt Arama Sonuçları',
  description:
    'Prompts34 üzerindeki yapay zeka promptlarını başlık, içerik, model ve etiketlere göre arayın.',
  alternates: {
    canonical: 'https://prompts34.com/prompts',
  },
  openGraph: {
    title: 'Prompt Arama Sonuçları | Prompts34',
    description:
      'Prompts34 üzerindeki yapay zeka promptlarını başlık, içerik, model ve etiketlere göre arayın.',
    url: 'https://prompts34.com/prompts',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prompt Arama Sonuçları | Prompts34',
    description:
      'Prompts34 üzerindeki yapay zeka promptlarını başlık, içerik, model ve etiketlere göre arayın.',
  },
};

export default async function PromptsPage() {
  let prompts: PromptResponse[] = [];
  let error: string | null = null;

  try {
    prompts = await getPublicPrompts();
  } catch (fetchError) {
    error = 'Promptlar yüklenirken bir hata oluştu';
    console.error(fetchError);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-3 text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          Prompt Arama Sonuçları
        </h1>

        {error ? (
          <div className="py-12 text-center text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : (
          <Suspense fallback={null}>
            <PromptsListingClient prompts={prompts} />
          </Suspense>
        )}
      </main>
    </div>
  );
}
