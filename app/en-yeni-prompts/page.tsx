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

const CANONICAL_URL = 'https://prompts34.com/en-yeni-prompts';

export const metadata: Metadata = {
  title: 'En Yeni Promptlar',
  description:
    'Prompts34 üzerindeki en yeni yapay zeka promptlarını keşfedin. ChatGPT, Claude ve diğer AI araçları için son eklenen promptlar.',
  openGraph: {
    title: 'En Yeni Promptlar | Prompts34',
    description:
      'Prompts34 üzerindeki en yeni yapay zeka promptlarını keşfedin.',
    type: 'website',
    url: CANONICAL_URL,
    siteName: 'Prompts34',
    locale: 'tr_TR',
    ...sharedOpenGraphImage,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'En Yeni Promptlar | Prompts34',
    description:
      'Prompts34 üzerindeki en yeni yapay zeka promptlarını keşfedin.',
    ...sharedTwitterImage,
  },
  alternates: {
    canonical: CANONICAL_URL,
  },
};

export default async function LatestPromptsPage() {
  const prompts = await getPublicPrompts().catch(() => []);
  const sortedPrompts = [...prompts].sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <BreadcrumbStructuredData
        items={[
          { name: 'Ana Sayfa', url: 'https://prompts34.com' },
          { name: 'En Yeni Promptlar', url: CANONICAL_URL },
        ]}
      />
      <CollectionPageStructuredData
        name="En Yeni Promptlar"
        description="Prompts34 üzerindeki en yeni yapay zeka promptları."
        url={CANONICAL_URL}
      />
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8 flex items-end justify-between gap-4">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
            En Yeni Promptlar
          </h1>
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
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h2 className="line-clamp-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {prompt.title}
                  </h2>
                  <span className="whitespace-nowrap text-xs text-zinc-500">
                    {new Date(prompt.created_at).toLocaleDateString('tr-TR')}
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
