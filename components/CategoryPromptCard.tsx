import Link from 'next/link';
import { PromptResponse } from '@/types/prompt';
import { getPromptPath } from '@/lib/utils/slug';
import PromptOutputImage from '@/components/PromptOutputImage';

type CategoryPromptCardProps = {
  prompt: PromptResponse;
};

function getPromptExcerpt(prompt: PromptResponse): string {
  const source = prompt.explanation || prompt.content;
  const normalized = source.replace(/\s+/g, ' ').trim();
  return normalized.length <= 220
    ? normalized
    : `${normalized.slice(0, 220).trimEnd()}…`;
}

export default function CategoryPromptCard({
  prompt,
}: CategoryPromptCardProps) {
  return (
    <article className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
      {prompt.output?.type === 'image' && (
        <Link
          href={getPromptPath(prompt)}
          className="block -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-lg border-b border-zinc-200 dark:border-zinc-800"
        >
          <PromptOutputImage
            src={prompt.output.value}
            alt={prompt.title}
            className="h-48 w-full object-cover"
          />
        </Link>
      )}
      <div className="flex justify-between items-start mb-2 gap-3">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          <Link
            href={getPromptPath(prompt)}
            className="underline-offset-4 transition hover:underline focus-visible:underline"
          >
            {prompt.title}
          </Link>
        </h3>
        {prompt.username && (
          <span className="text-xs text-zinc-500 dark:text-zinc-500">
            @{prompt.username}
          </span>
        )}
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
        {getPromptExcerpt(prompt)}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {prompt.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
          >
            {tag}
          </span>
        ))}
      </div>
      {prompt.suggested_model && (
        <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-4">
          Önerilen model: {prompt.suggested_model}
        </p>
      )}
      <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
        {new Date(prompt.created_at).toLocaleDateString('tr-TR')}
      </div>
    </article>
  );
}
