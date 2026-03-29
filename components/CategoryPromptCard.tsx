import Link from 'next/link';
import { PromptResponse } from '@/types/prompt';

type CategoryPromptCardProps = {
  prompt: PromptResponse;
};

export default function CategoryPromptCard({
  prompt,
}: CategoryPromptCardProps) {
  return (
    <article className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
      <div className="flex justify-between items-start mb-2 gap-3">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          <Link
            href={`/prompts/${prompt.id}`}
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
      {prompt.explanation && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          {prompt.explanation}
        </p>
      )}
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
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
        <pre className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap font-mono bg-zinc-50 dark:bg-zinc-900 p-3 rounded">
          {prompt.content}
        </pre>
      </div>
      <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
        {new Date(prompt.created_at).toLocaleDateString('tr-TR')}
      </div>
    </article>
  );
}
