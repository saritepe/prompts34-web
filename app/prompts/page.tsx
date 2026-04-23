import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import CategoryPromptCard from '@/components/CategoryPromptCard';
import { getPublicPrompts } from '@/lib/api/prompts';
import type { PromptResponse } from '@/types/prompt';

export const dynamic = 'force-dynamic';

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

type PromptsPageSearchParams = Record<string, string | string[] | undefined>;

type PromptsPageProps = {
  searchParams?: Promise<PromptsPageSearchParams> | PromptsPageSearchParams;
};

function getQuery(searchParams: PromptsPageSearchParams): string {
  const query = searchParams.q;
  if (typeof query === 'string') return query;
  if (Array.isArray(query)) return query[0] ?? '';
  return '';
}

function filterPrompts(
  prompts: PromptResponse[],
  query: string,
): PromptResponse[] {
  const normalizedQuery = query.trim().toLocaleLowerCase('tr-TR');
  if (!normalizedQuery) {
    return prompts;
  }

  return prompts.filter((prompt) => {
    const haystack = [
      prompt.title,
      prompt.content,
      prompt.explanation || '',
      prompt.suggested_model || '',
      prompt.username || '',
      prompt.tags.join(' '),
    ]
      .join(' ')
      .toLocaleLowerCase('tr-TR');

    return haystack.includes(normalizedQuery);
  });
}

export default async function PromptsPage({ searchParams }: PromptsPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const query = getQuery(resolvedSearchParams);
  let prompts: PromptResponse[] = [];
  let error: string | null = null;

  try {
    const publicPrompts = await getPublicPrompts();
    prompts = filterPrompts(publicPrompts, query);
  } catch (fetchError) {
    error = 'Promptlar yüklenirken bir hata oluştu';
    console.error(fetchError);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="mb-3 text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            Prompt Arama Sonuçları
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            {query
              ? `"${query}" aramasıyla eşleşen promptlar listeleniyor.`
              : 'Tüm herkese açık promptlar listeleniyor.'}
          </p>
        </div>

        {error ? (
          <div className="py-12 text-center text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : prompts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700">
            Bu arama için henüz prompt bulunmuyor.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {prompts.map((prompt) => (
              <CategoryPromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
