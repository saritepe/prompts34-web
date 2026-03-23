import Navigation from '@/components/Navigation';
import CopyContentButton from '@/components/CopyContentButton';
import PromptVoteButton from '@/components/PromptVoteButton';
import { getPrompt } from '@/lib/api/prompts';
import { notFound } from 'next/navigation';

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prompt = await getPrompt(id).catch(() => null);

  if (!prompt) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Navigation />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-4 flex justify-end">
            <PromptVoteButton
              promptId={prompt.id}
              initialLikeCount={prompt.like_count}
              initialLikedByMe={prompt.liked_by_me}
            />
          </div>
          <p className="mb-2 text-sm text-zinc-500">
            {new Date(prompt.created_at).toLocaleDateString('tr-TR')}
          </p>
          <h1 className="mb-2 text-4xl font-black text-zinc-900 dark:text-zinc-50">
            {prompt.title}
          </h1>
          {prompt.explanation && (
            <p className="mb-5 text-xl text-zinc-600 dark:text-zinc-300">
              {prompt.explanation}
            </p>
          )}

          <div className="mb-6 flex flex-wrap gap-2">
            {prompt.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mb-8 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                İçerik
              </h2>
              <CopyContentButton content={prompt.content} />
            </div>
            <pre className="whitespace-pre-wrap text-[8pt] leading-6 text-zinc-800 dark:text-zinc-200">
              {prompt.content}
            </pre>
          </div>

          <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <h3 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Yorumlar (0)
            </h3>
            <textarea
              placeholder="Yorum yaz..."
              className="mb-3 min-h-28 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none ring-amber-300 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
            <div className="flex justify-end">
              <button className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
                Yorum Gönder
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
