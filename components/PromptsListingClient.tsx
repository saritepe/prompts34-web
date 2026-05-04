'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import CategoryPromptCard from '@/components/CategoryPromptCard';
import type { PromptResponse } from '@/types/prompt';

type PromptsListingClientProps = {
  prompts: PromptResponse[];
};

function getQuery(searchParams: URLSearchParams): string {
  return searchParams.get('q') ?? '';
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

export default function PromptsListingClient({
  prompts,
}: PromptsListingClientProps) {
  const searchParams = useSearchParams();
  const query = getQuery(
    searchParams ?? (new URLSearchParams() as unknown as URLSearchParams),
  );

  const visiblePrompts = useMemo(
    () => filterPrompts(prompts, query),
    [prompts, query],
  );

  return (
    <>
      <p className="mb-10 text-zinc-600 dark:text-zinc-400">
        {query
          ? `"${query}" aramasıyla eşleşen promptlar listeleniyor.`
          : 'Tüm herkese açık promptlar listeleniyor.'}
      </p>

      {visiblePrompts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700">
          Bu arama için henüz prompt bulunmuyor.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visiblePrompts.map((prompt) => (
            <CategoryPromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}
    </>
  );
}
