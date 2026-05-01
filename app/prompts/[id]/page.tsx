import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import CopyContentButton from '@/components/CopyContentButton';
import PromptVoteButton from '@/components/PromptVoteButton';
import CommentSection from '@/components/CommentSection';
import { PromptStructuredData } from '@/app/components/StructuredData';
import {
  sharedOpenGraphImage,
  sharedTwitterImage,
} from '@/app/shared-metadata';
import { getPrompt } from '@/lib/api/prompts';
import { buildDescription } from '@/lib/metadata';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const prompt = await getPrompt(id).catch(() => null);

  if (!prompt) {
    return notFound();
  }

  const description = buildDescription(prompt.explanation || prompt.content);
  const title = prompt.title;
  const fullTitle = `${title} | Prompts34`;
  const url = `/prompts/${prompt.id}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      ...sharedOpenGraphImage,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      ...sharedTwitterImage,
    },
  };
}

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

  const description = buildDescription(prompt.explanation || prompt.content);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <PromptStructuredData
        title={prompt.title}
        description={description}
        url={`https://prompts34.com/prompts/${prompt.id}`}
        datePublished={prompt.created_at}
      />
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

          <CommentSection
            promptId={prompt.id}
            promptOwnerId={prompt.user_id}
            initialCommentCount={prompt.comment_count}
          />
        </section>
      </main>
    </div>
  );
}
