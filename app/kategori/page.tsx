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
import {
  getCategoryGroupSummaries,
  type CategoryGroupSummary,
} from '@/lib/category-groups';
import { getTopicPath } from '@/lib/topics';

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

function CategoryGroupSection({ group }: { group: CategoryGroupSummary }) {
  return (
    <section
      key={group.slug}
      className="border-t border-zinc-200 py-10 first:border-t-0 first:pt-0 dark:border-zinc-800"
    >
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-3xl leading-none">{group.icon}</p>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {group.title}
          </h2>
          <p className="mt-2 max-w-3xl text-base text-zinc-600 dark:text-zinc-400">
            {group.description}
          </p>
        </div>
        <div className="flex gap-8 text-sm text-zinc-600 dark:text-zinc-400">
          <div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {group.promptCount}
            </div>
            <div>prompt</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {group.topics.length}
            </div>
            <div>alt kategori</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {group.topics.map((topic) => (
          <Link
            key={topic.slug}
            href={getTopicPath(topic)}
            className="block rounded-2xl border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
          >
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {topic.title}
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {topic.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function KategoriHubPage() {
  const prompts = await getPublicPrompts().catch(() => []);
  const groups = getCategoryGroupSummaries(prompts);

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
            Yapay zeka promptlarını önce genel alanlara göre keşfedin, ardından
            her alanın altındaki spesifik kategorilere geçin.
          </p>
        </div>

        <div>
          {groups.map((group) => (
            <CategoryGroupSection key={group.slug} group={group} />
          ))}
        </div>
      </main>
    </div>
  );
}
