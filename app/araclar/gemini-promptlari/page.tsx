import { Metadata } from 'next';
import {
  sharedOpenGraphImage,
  sharedTwitterImage,
} from '@/app/shared-metadata';
import { getPublicPrompts } from '@/lib/api/prompts';
import { PromptResponse } from '@/types/prompt';
import CategoryPromptCard from '@/components/CategoryPromptCard';
import Navigation from '@/components/Navigation';
import {
  BreadcrumbStructuredData,
  CollectionPageStructuredData,
} from '@/app/components/StructuredData';
import { GEMINI_HUB, matchPromptsForToolHub } from '@/lib/tool-hubs';

export const revalidate = 300;

const CANONICAL_URL = `https://prompts34.com${GEMINI_HUB.canonicalPath}`;

export const metadata: Metadata = {
  title: GEMINI_HUB.title,
  description: GEMINI_HUB.description,
  keywords: GEMINI_HUB.keywords,
  openGraph: {
    title: `${GEMINI_HUB.title} | Prompts34`,
    description: GEMINI_HUB.description,
    type: 'website',
    url: CANONICAL_URL,
    siteName: 'Prompts34',
    locale: 'tr_TR',
    ...sharedOpenGraphImage,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${GEMINI_HUB.title} | Prompts34`,
    description: GEMINI_HUB.description,
    ...sharedTwitterImage,
  },
  alternates: {
    canonical: CANONICAL_URL,
  },
};

export default async function GeminiPromptlariPage() {
  let prompts: PromptResponse[] = [];
  let error: string | null = null;

  try {
    const allPrompts = await getPublicPrompts();
    prompts = matchPromptsForToolHub(allPrompts, GEMINI_HUB);
  } catch (err) {
    error = 'Promptlar yüklenirken bir hata oluştu';
    console.error(err);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <BreadcrumbStructuredData
        items={[
          { name: 'Ana Sayfa', url: 'https://prompts34.com' },
          { name: 'Araçlar', url: 'https://prompts34.com/araclar' },
          { name: GEMINI_HUB.breadcrumbName, url: CANONICAL_URL },
        ]}
      />
      <CollectionPageStructuredData
        name={GEMINI_HUB.title}
        description={GEMINI_HUB.description}
        url={CANONICAL_URL}
      />
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            {GEMINI_HUB.introHeading}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
            {GEMINI_HUB.introBody}
          </p>
          <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3">
              {GEMINI_HUB.tipsHeading}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-purple-800 dark:text-purple-200">
              {GEMINI_HUB.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">
              {GEMINI_HUB.emptyMessage}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <CategoryPromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
