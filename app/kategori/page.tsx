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
import { TOPICS, getTopicPath } from '@/lib/topics';

export const revalidate = false;

const CANONICAL_URL = 'https://prompts34.com/kategori';

export const metadata: Metadata = {
  title: 'AI Prompt Kategorileri',
  description:
    'Yapay zeka promptlarını kategorilere göre keşfedin. CV hazırlama, pazarlama, yazılım, görsel üretim ve daha fazlası için özel prompt koleksiyonları.',
  keywords: [
    'ai prompt kategorileri',
    'yapay zeka prompt konuları',
    'chatgpt prompt kategorisi',
    'türkçe ai promptlar',
  ],
  openGraph: {
    title: 'AI Prompt Kategorileri | Prompts34',
    description:
      'Yapay zeka promptlarını kategorilere göre keşfedin. Özel olarak hazırlanmış prompt koleksiyonları.',
    type: 'website',
    url: CANONICAL_URL,
    siteName: 'Prompts34',
    locale: 'tr_TR',
    ...sharedOpenGraphImage,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Prompt Kategorileri | Prompts34',
    description:
      'Yapay zeka promptlarını kategorilere göre keşfedin. Özel olarak hazırlanmış prompt koleksiyonları.',
    ...sharedTwitterImage,
  },
  alternates: {
    canonical: CANONICAL_URL,
  },
};

export default function KategoriHubPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <BreadcrumbStructuredData
        items={[
          { name: 'Ana Sayfa', url: 'https://prompts34.com' },
          { name: 'Kategoriler', url: CANONICAL_URL },
        ]}
      />
      <CollectionPageStructuredData
        name="AI Prompt Kategorileri"
        description="Yapay zeka promptlarını kategorilere göre keşfedin."
        url={CANONICAL_URL}
      />
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            AI Prompt Kategorileri
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Yapay zeka promptlarını kategorilere göre keşfedin. Her kategori
            için özel olarak seçilmiş ve düzenlenmiş prompt koleksiyonları.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOPICS.map((topic) => (
            <Link
              key={topic.slug}
              href={getTopicPath(topic)}
              className="block rounded-lg border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
            >
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                {topic.title}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                {topic.description}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
