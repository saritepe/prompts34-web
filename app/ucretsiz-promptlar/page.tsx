import { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import {
  BreadcrumbStructuredData,
  CollectionPageStructuredData,
} from '@/app/components/StructuredData';
import {
  sharedOpenGraphImage,
  sharedTwitterImage,
} from '@/app/shared-metadata';
import { getPublicPrompts } from '@/lib/api/prompts';
import CategoryPromptCard from '@/components/CategoryPromptCard';

export const revalidate = 300;

const CANONICAL_URL = 'https://prompts34.com/ucretsiz-promptlar';

export const metadata: Metadata = {
  title: 'Ücretsiz Yapay Zeka Promptları',
  description:
    'ChatGPT, Claude ve Gemini için ücretsiz Türkçe hazır promptlar. CV hazırlama, logo oluşturma, pazarlama ve daha fazlası.',
  keywords: [
    'ücretsiz prompt',
    'ucretsiz prompt',
    'ücretsiz chatgpt promptları',
    'ücretsiz yapay zeka promptları',
    'hazır promptlar',
    'türkçe ai promptları',
  ],
  openGraph: {
    title: 'Ücretsiz Yapay Zeka Promptları | Prompts34',
    description:
      'ChatGPT, Claude ve Gemini için ücretsiz Türkçe hazır promptlar.',
    type: 'website',
    url: CANONICAL_URL,
    siteName: 'Prompts34',
    locale: 'tr_TR',
    ...sharedOpenGraphImage,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ücretsiz Yapay Zeka Promptları | Prompts34',
    description:
      'ChatGPT, Claude ve Gemini için ücretsiz Türkçe hazır promptlar.',
    ...sharedTwitterImage,
  },
  alternates: {
    canonical: CANONICAL_URL,
  },
};

export default async function UcretsizPromptlarPage() {
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
          { name: 'Ücretsiz Promptlar', url: CANONICAL_URL },
        ]}
      />
      <CollectionPageStructuredData
        name="Ücretsiz Yapay Zeka Promptları"
        description="ChatGPT, Claude ve Gemini için ücretsiz Türkçe hazır promptlar."
        url={CANONICAL_URL}
      />
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Ücretsiz Yapay Zeka Promptları
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            ChatGPT, Claude, Gemini ve diğer yapay zeka araçları için ücretsiz
            Türkçe hazır promptlar. Hepsini kopyalayın, düzenleyin ve kullanın.
          </p>
        </div>

        {sortedPrompts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
            Henüz prompt bulunmuyor.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPrompts.map((prompt) => (
              <CategoryPromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
