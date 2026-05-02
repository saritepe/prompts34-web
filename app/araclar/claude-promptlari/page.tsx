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
import { CLAUDE_HUB, matchPromptsForToolHub } from '@/lib/tool-hubs';

export const revalidate = 300;

const CANONICAL_URL = `https://prompts34.com${CLAUDE_HUB.canonicalPath}`;

export const metadata: Metadata = {
  title: CLAUDE_HUB.title,
  description: CLAUDE_HUB.description,
  keywords: CLAUDE_HUB.keywords,
  openGraph: {
    title: `${CLAUDE_HUB.title} | Prompts34`,
    description: CLAUDE_HUB.description,
    type: 'website',
    url: CANONICAL_URL,
    siteName: 'Prompts34',
    locale: 'tr_TR',
    ...sharedOpenGraphImage,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${CLAUDE_HUB.title} | Prompts34`,
    description: CLAUDE_HUB.description,
    ...sharedTwitterImage,
  },
  alternates: {
    canonical: CANONICAL_URL,
  },
};

export default async function ClaudePromptlariPage() {
  let prompts: PromptResponse[] = [];
  let error: string | null = null;

  try {
    const allPrompts = await getPublicPrompts();
    prompts = matchPromptsForToolHub(allPrompts, CLAUDE_HUB);
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
          { name: CLAUDE_HUB.breadcrumbName, url: CANONICAL_URL },
        ]}
      />
      <CollectionPageStructuredData
        name={CLAUDE_HUB.title}
        description={CLAUDE_HUB.description}
        url={CANONICAL_URL}
      />
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            {CLAUDE_HUB.introHeading}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
            {CLAUDE_HUB.introBody}
          </p>
          <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-3">
              {CLAUDE_HUB.tipsHeading}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-orange-800 dark:text-orange-200">
              {CLAUDE_HUB.tips.map((tip) => (
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
              {CLAUDE_HUB.emptyMessage}
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
