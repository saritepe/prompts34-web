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
import { getPublicPrompts } from '@/lib/api/prompts';
import { getPromptPath } from '@/lib/utils/slug';

export const revalidate = 300;

const CANONICAL_URL = 'https://prompts34.com/one-cikanlar';

export const metadata: Metadata = {
  title: 'Öne Çıkan Promptlar',
  description:
    'Prompts34 üzerindeki en çok beğenilen yapay zeka promptlarını keşfedin. ChatGPT, Claude ve diğer AI araçları için öne çıkan promptlar.',
  openGraph: {
    title: 'Öne Çıkan Promptlar | Prompts34',
    description:
      'Prompts34 üzerindeki en çok beğenilen yapay zeka promptlarını keşfedin.',
    type: 'website',
    url: CANONICAL_URL,
    siteName: 'Prompts34',
    locale: 'tr_TR',
    ...sharedOpenGraphImage,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Öne Çıkan Promptlar | Prompts34',
    description:
      'Prompts34 üzerindeki en çok beğenilen yapay zeka promptlarını keşfedin.',
    ...sharedTwitterImage,
  },
  alternates: {
    canonical: CANONICAL_URL,
  },
};

export default async function FeaturedPromptsPage() {
  const prompts = await getPublicPrompts().catch(() => []);
  const sortedPrompts = [...prompts].sort(
    (a, b) =>
      b.like_count - a.like_count ||
      +new Date(b.created_at) - +new Date(a.created_at),
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <BreadcrumbStructuredData
        items={[
          { name: 'Ana Sayfa', url: 'https://prompts34.com' },
          { name: 'Öne Çıkan Promptlar', url: CANONICAL_URL },
        ]}
      />
      <CollectionPageStructuredData
        name="Öne Çıkan Promptlar"
        description="Prompts34 üzerindeki en çok beğenilen yapay zeka promptları."
        url={CANONICAL_URL}
      />
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
              Öne Çıkan Promptlar
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Oylara göre azalan sırada tüm promptlar.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Ana Sayfa
          </Link>
        </section>

        {sortedPrompts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
            Henüz prompt bulunmuyor.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sortedPrompts.map((prompt) => (
              <Link
                key={prompt.id}
                href={getPromptPath(prompt)}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="line-clamp-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {prompt.title}
                  </h2>
                  <span className="whitespace-nowrap rounded-md border border-zinc-300 px-2 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
                    👍 {prompt.like_count}
                  </span>
                </div>
                {prompt.explanation && (
                  <p className="line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {prompt.explanation}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
