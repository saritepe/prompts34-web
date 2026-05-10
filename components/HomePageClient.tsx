'use client';

import type { MouseEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Navigation from '@/components/Navigation';
import PromptOutputImage from '@/components/PromptOutputImage';
import { getPublicPrompts, votePrompt } from '@/lib/api/prompts';
import { useAuth } from '@/lib/auth';
import { findTopicByKeyword, getTopicPath, normalizeQuery } from '@/lib/topics';
import type { PromptResponse } from '@/types/prompt';

type HomePageClientProps = {
  initialPrompts: PromptResponse[];
  initialLoadError: string | null;
};

function getPromptType(tags: string[]): 'Görsel' | 'Video' | 'Metin' {
  const normalized = tags.map((tag) => tag.toLowerCase());

  if (normalized.some((tag) => tag.includes('video') || tag.includes('reel'))) {
    return 'Video';
  }

  if (
    normalized.some(
      (tag) =>
        tag.includes('gorsel') ||
        tag.includes('görsel') ||
        tag.includes('image') ||
        tag.includes('logo') ||
        tag.includes('midjourney'),
    )
  ) {
    return 'Görsel';
  }

  return 'Metin';
}

function getPromptScore(prompt: PromptResponse): number {
  const now = Date.now();
  const createdAt = new Date(prompt.created_at).getTime();
  const daysOld = Math.max(
    1,
    Math.floor((now - createdAt) / (1000 * 60 * 60 * 24)),
  );
  const freshness = Math.max(1, 40 - daysOld);
  const detailsBoost =
    (prompt.explanation ? 8 : 0) + (prompt.suggested_model ? 6 : 0);
  const tagsBoost = Math.min(prompt.tags.length * 3, 15);
  const lengthBoost = Math.min(Math.floor(prompt.content.length / 140), 12);

  return freshness + detailsBoost + tagsBoost + lengthBoost;
}

function PromptCard({
  prompt,
  onVote,
}: {
  prompt: PromptResponse;
  onVote: (promptId: string) => Promise<void>;
}) {
  const promptType = getPromptType(prompt.tags);
  const [voting, setVoting] = useState(false);
  const promptHref = `/prompts/${prompt.id}`;

  async function handleVote(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    try {
      setVoting(true);
      await onVote(prompt.id);
    } finally {
      setVoting(false);
    }
  }

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
      {prompt.output?.type === 'image' && (
        <Link
          href={promptHref}
          className="-mx-5 -mt-5 mb-4 block overflow-hidden rounded-t-2xl border-b border-zinc-200 dark:border-zinc-800"
        >
          <PromptOutputImage
            src={prompt.output.value}
            alt={prompt.title}
            className="h-44 w-full object-cover"
          />
        </Link>
      )}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <span className="mb-2 inline-flex rounded-full border border-zinc-300 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
            {promptType}
          </span>
          <h3 className="line-clamp-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            <Link
              href={promptHref}
              className="rounded-sm hover:underline focus:outline-none focus-visible:underline"
            >
              {prompt.title}
            </Link>
          </h3>
        </div>
        <div className="flex flex-col items-end gap-2">
          {prompt.username && (
            <span className="text-xs text-zinc-500">@{prompt.username}</span>
          )}
          <button
            onClick={handleVote}
            disabled={voting}
            className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-2 py-1 text-xs font-medium ${
              prompt.liked_by_me
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200'
                : 'border-zinc-300 text-zinc-600 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-100'
            }`}
          >
            👍 {prompt.like_count}
          </button>
          <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            💬 {prompt.comment_count}
          </span>
        </div>
      </div>

      {prompt.explanation && (
        <p className="mb-4 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
          {prompt.explanation}
        </p>
      )}

      <div className="mt-auto rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
        <pre className="line-clamp-5 whitespace-pre-wrap font-mono text-xs text-zinc-700 dark:text-zinc-300">
          {prompt.content}
        </pre>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {prompt.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

function PromptSection({
  id,
  title,
  description,
  prompts,
  onVote,
  viewAllHref = '/',
}: {
  id: string;
  title: string;
  description?: string;
  prompts: PromptResponse[];
  onVote: (promptId: string) => Promise<void>;
  viewAllHref?: string;
}) {
  return (
    <section id={id} className="mb-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          )}
        </div>
        <Link
          href={viewAllHref}
          className="text-sm font-semibold text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
        >
          Tümünü Gör
        </Link>
      </div>

      {prompts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
          Bu bölüm için henüz prompt bulunmuyor.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} onVote={onVote} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function HomePageClient({
  initialPrompts,
  initialLoadError,
}: HomePageClientProps) {
  const router = useRouter();
  const { token, loading } = useAuth();
  const authToken = token;
  const [prompts, setPrompts] = useState<PromptResponse[]>(initialPrompts);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(initialLoadError);

  useEffect(() => {
    if (loading || !authToken) {
      return;
    }

    const refreshToken = authToken;
    let cancelled = false;

    async function refreshPrompts() {
      try {
        const refreshedPrompts = await getPublicPrompts(refreshToken);
        if (cancelled) {
          return;
        }
        setPrompts(refreshedPrompts);
        setError(null);
      } catch (refreshError) {
        console.error(
          'Failed to refresh homepage prompts for authenticated user.',
          refreshError,
        );
      }
    }

    refreshPrompts();

    return () => {
      cancelled = true;
    };
  }, [authToken, loading]);

  async function handleVote(promptId: string) {
    if (!token) {
      alert('Beğenmek için giriş yapmalısınız.');
      return;
    }

    try {
      const result = await votePrompt(promptId, token);
      setPrompts((prevPrompts) =>
        prevPrompts.map((prompt) =>
          prompt.id === promptId
            ? {
                ...prompt,
                like_count: result.like_count,
                liked_by_me: result.liked,
              }
            : prompt,
        ),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Oylama sırasında hata oluştu';
      alert(message);
    }
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedSearch = normalizeQuery(search);
    if (!normalizedSearch) {
      return;
    }

    const matchingTopic = findTopicByKeyword(normalizedSearch);
    if (matchingTopic) {
      router.push(getTopicPath(matchingTopic));
      return;
    }

    router.push(`/prompts?q=${encodeURIComponent(normalizedSearch)}`);
  }

  const filteredPrompts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
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
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [prompts, search]);

  const sortedByDate = useMemo(
    () =>
      [...filteredPrompts].sort(
        (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
      ),
    [filteredPrompts],
  );

  const featuredPrompts = useMemo(
    () =>
      [...filteredPrompts]
        .sort(
          (a, b) =>
            b.like_count - a.like_count ||
            getPromptScore(b) - getPromptScore(a),
        )
        .slice(0, 6),
    [filteredPrompts],
  );

  const latestPrompts = sortedByDate.slice(0, 6);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-12 rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-100 via-orange-50 to-amber-50 px-5 py-10 shadow-sm dark:border-amber-900/40 dark:from-amber-950/30 dark:via-zinc-950 dark:to-orange-950/20 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
          <h1 className="max-w-6xl text-[clamp(2.75rem,7.2vw,6.75rem)] font-black leading-[0.95] text-zinc-900 dark:text-zinc-50">
            <span className="block">Türkçe hazır yapay zeka</span>
            <span className="block bg-gradient-to-r from-amber-700 via-orange-500 to-amber-600 bg-clip-text text-transparent dark:from-amber-200 dark:via-orange-300 dark:to-amber-400">
              prompt kütüphanesi
            </span>
          </h1>
          <p className="mt-6 max-w-6xl text-lg font-medium leading-8 text-zinc-700 dark:text-zinc-300 sm:text-xl lg:text-2xl lg:leading-9">
            ChatGPT, Claude, Gemini ve diğer yapay zeka araçları için topluluk
            tarafından üretilen hazır promptları ara, kopyala ve ihtiyacına
            uygun içerikleri hızlıca bul.
          </p>
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 max-w-6xl rounded-[2rem] border-2 border-zinc-400 bg-white p-2 shadow-[0_18px_45px_rgba(180,83,9,0.18)] dark:border-zinc-600 dark:bg-zinc-950"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Başlık, etiket, model veya içerik ara"
                className="min-h-14 w-full rounded-[1.5rem] border-0 bg-transparent px-5 py-4 text-base font-semibold text-zinc-900 outline-none placeholder:text-zinc-500 focus:ring-0 dark:text-zinc-100 dark:placeholder:text-zinc-500 sm:text-lg"
              />
              <div className="flex items-center gap-2 md:shrink-0">
                <button
                  type="submit"
                  className="min-h-14 flex-1 whitespace-nowrap rounded-[1.5rem] bg-zinc-900 px-7 py-4 text-sm font-bold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 md:flex-none"
                >
                  Promptları Keşfet
                </button>
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="min-h-14 rounded-[1.5rem] border border-zinc-400 px-4 py-4 text-sm font-semibold text-zinc-700 dark:border-zinc-600 dark:text-zinc-300"
                  >
                    Temizle
                  </button>
                )}
              </div>
            </div>
          </form>
        </section>

        {error ? (
          <div className="py-16 text-center text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : (
          <>
            <PromptSection
              id="one-cikanlar"
              title="Öne Çıkan Promptlar"
              description="Topluluk tarafından en çok beğenilen promptlar."
              prompts={featuredPrompts}
              onVote={handleVote}
              viewAllHref="/one-cikanlar"
            />
            <PromptSection
              id="bugunun-secimleri"
              title="En Yeni Promptlar"
              description="Kütüphaneye en son eklenen promptlar."
              prompts={latestPrompts}
              onVote={handleVote}
              viewAllHref="/en-yeni-prompts"
            />
          </>
        )}
      </main>
    </div>
  );
}
