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
import { PROFESSIONS, getProfessionPath } from '@/lib/professions';

export const revalidate = false;

const CANONICAL_URL = 'https://prompts34.com/meslek';

export const metadata: Metadata = {
  title: 'Mesleğe Göre Yapay Zeka Promptları',
  description:
    'Yazılımcılar, pazarlamacılar, öğretmenler, avukatlar ve daha fazla meslek için özel olarak seçilmiş Türkçe yapay zeka promptları. Mesleğinize uygun ChatGPT, Claude ve Gemini promptlarını keşfedin.',
  keywords: [
    'mesleğe göre prompt',
    'yazılımcı promptları',
    'öğretmen promptları',
    'pazarlamacı prompt',
    'iş için chatgpt',
    'türkçe ai prompt',
  ],
  openGraph: {
    title: 'Mesleğe Göre Yapay Zeka Promptları | Prompts34',
    description:
      'Mesleğinize özel hazırlanmış Türkçe yapay zeka prompt koleksiyonları.',
    type: 'website',
    url: CANONICAL_URL,
    siteName: 'Prompts34',
    locale: 'tr_TR',
    ...sharedOpenGraphImage,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mesleğe Göre Yapay Zeka Promptları | Prompts34',
    description:
      'Mesleğinize özel hazırlanmış Türkçe yapay zeka prompt koleksiyonları.',
    ...sharedTwitterImage,
  },
  alternates: { canonical: CANONICAL_URL },
};

export default function MeslekHubPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <BreadcrumbStructuredData
        items={[
          { name: 'Ana Sayfa', url: 'https://prompts34.com' },
          { name: 'Meslekler', url: CANONICAL_URL },
        ]}
      />
      <CollectionPageStructuredData
        name="Mesleğe Göre Yapay Zeka Promptları"
        description="Mesleğinize özel hazırlanmış Türkçe yapay zeka prompt koleksiyonları."
        url={CANONICAL_URL}
      />
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Mesleğe Göre Yapay Zeka Promptları
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Mesleğinize özel hazırlanmış Türkçe yapay zeka prompt
            koleksiyonları. Yazılımcı, öğretmen, pazarlamacı, avukat ve daha
            fazlası için ChatGPT, Claude ve Gemini promptları.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROFESSIONS.map((profession) => (
            <Link
              key={profession.slug}
              href={getProfessionPath(profession)}
              className="block rounded-lg border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
            >
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                {profession.title}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                {profession.description}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
