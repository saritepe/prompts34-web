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
import { USE_CASES, getUseCasePath } from '@/lib/use-cases';

export const revalidate = false;

const CANONICAL_URL = 'https://prompts34.com/kullanim';

export const metadata: Metadata = {
  title: 'Kullanım Alanlarına Göre Yapay Zeka Promptları',
  description:
    'E-posta yazma, blog, ürün açıklaması, çeviri, özet çıkarma, SQL ve daha fazlası için Türkçe yapay zeka promptları. İhtiyacınıza uygun ChatGPT ve Claude komutlarını keşfedin.',
  keywords: [
    'kullanım alanlarına göre prompt',
    'email prompt',
    'blog prompt',
    'çeviri prompt',
    'özet prompt',
    'türkçe ai prompt',
  ],
  openGraph: {
    title: 'Kullanım Alanlarına Göre Yapay Zeka Promptları | Prompts34',
    description:
      'İhtiyacınıza özel hazırlanmış Türkçe yapay zeka prompt koleksiyonları.',
    type: 'website',
    url: CANONICAL_URL,
    siteName: 'Prompts34',
    locale: 'tr_TR',
    ...sharedOpenGraphImage,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kullanım Alanlarına Göre Yapay Zeka Promptları | Prompts34',
    description:
      'İhtiyacınıza özel hazırlanmış Türkçe yapay zeka prompt koleksiyonları.',
    ...sharedTwitterImage,
  },
  alternates: { canonical: CANONICAL_URL },
};

export default function KullanimHubPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <BreadcrumbStructuredData
        items={[
          { name: 'Ana Sayfa', url: 'https://prompts34.com' },
          { name: 'Kullanım Alanları', url: CANONICAL_URL },
        ]}
      />
      <CollectionPageStructuredData
        name="Kullanım Alanlarına Göre Yapay Zeka Promptları"
        description="İhtiyacınıza özel hazırlanmış Türkçe yapay zeka prompt koleksiyonları."
        url={CANONICAL_URL}
      />
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Kullanım Alanlarına Göre Yapay Zeka Promptları
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            E-posta yazma, blog yazısı, ürün açıklaması, çeviri, özet çıkarma,
            SQL sorgusu ve daha fazlası için ChatGPT, Claude ve Gemini ile
            kullanılabilecek Türkçe hazır promptlar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {USE_CASES.map((useCase) => (
            <Link
              key={useCase.slug}
              href={getUseCasePath(useCase)}
              className="block rounded-lg border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
            >
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                {useCase.title}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                {useCase.description}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
