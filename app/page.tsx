'use client';

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { getPublicPrompts, votePrompt } from '@/lib/api/prompts';
import { PromptResponse } from '@/types/prompt';
import Navigation from '@/components/Navigation';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

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
  const router = useRouter();
  const promptType = getPromptType(prompt.tags);
  const [voting, setVoting] = useState(false);

  function navigateToPrompt() {
    const targetUrl = `/prompts/${prompt.id}`;

    try {
      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => void;
      };
      (
        doc.startViewTransition?.bind(doc) ??
        ((callback: () => void) => callback())
      )(() => router.push(targetUrl));
      return;
    } catch (err) {
      console.error(
        'View transition failed, fallback navigation applied.',
        err,
      );
    }

    router.push(targetUrl);
  }

  async function handleVote(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    try {
      setVoting(true);
      await onVote(prompt.id);
    } finally {
      setVoting(false);
    }
  }

  return (
    <article
      onClick={navigateToPrompt}
      className="group flex h-full cursor-pointer flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <span className="mb-2 inline-flex rounded-full border border-zinc-300 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
            {promptType}
          </span>
          <h3 className="line-clamp-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {prompt.title}
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

function PromptCardSkeleton() {
  return (
    <article className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-3 h-5 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
      <div className="mb-2 h-6 w-4/5 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mb-4 h-4 w-2/3 rounded bg-zinc-100 dark:bg-zinc-900" />
      <div className="mb-4 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-6 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-6 w-14 rounded-full bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="mb-4 h-24 rounded-xl bg-zinc-100 dark:bg-zinc-900" />
      <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
    </article>
  );
}

export default function Home() {
  const { token, user } = useAuth();
  const [prompts, setPrompts] = useState<PromptResponse[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrompts() {
      try {
        setLoading(true);
        const data = await getPublicPrompts(token ?? undefined);
        setPrompts(data);

        const params = new URLSearchParams(window.location.search);
        const query = params.get('q');
        if (query) {
          setSearch(query);
        }
      } catch (err) {
        setError('Promptlar yüklenirken bir hata oluştu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPrompts();
  }, [token]);

  async function handleVote(promptId: string) {
    if (!token) {
      alert('Beğenmek için giriş yapmalısınız.');
      return;
    }

    try {
      const result = await votePrompt(promptId, token);
      setPrompts((prev) =>
        prev.map((prompt) =>
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

  const quickFilters = [
    'cv',
    'mülakat',
    'motivasyon',
    'görsel',
    'logo',
    'kapak mektubu',
    'özgeçmiş',
    'linkedin',
    'staj',
    'iş başvurusu',
    'kariyer',
    'içerik üretimi',
    'sosyal medya',
    'sunum',
    'e-posta',
    'analiz',
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-12 overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-amber-100 via-white to-cyan-100 p-8 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="mb-4 inline-flex rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white dark:bg-zinc-100 dark:text-zinc-900">
                Türkçe Yapay Zeka Prompt Platformu
              </p>
              <h1 className="mb-4 max-w-3xl text-4xl font-black leading-tight text-zinc-900 dark:text-zinc-50 md:text-5xl">
                Türkçe yapay zeka promptlarını keşfet, paylaş, geliştir.
              </h1>
              <p className="mb-7 max-w-2xl text-base text-zinc-700 dark:text-zinc-300 md:text-lg">
                ChatGPT, Claude, Gemini ve diğer yapay zeka araçları için
                topluluk tarafından üretilen prompt kütüphanesi. Hızlıca ara,
                kopyala ve kendi prompt koleksiyonunu oluştur.
              </p>
              <div className="flex flex-wrap gap-3">
                {!token && !user && (
                  <>
                    <Link
                      href="/kayit"
                      className="rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Ücretsiz Kaydol
                    </Link>
                    <Link
                      href="/giris"
                      className="rounded-lg border border-transparent px-5 py-3 text-sm font-semibold text-zinc-700 hover:underline dark:text-zinc-300"
                    >
                      Giriş Yap
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="lg:pt-8">
              <div className="rounded-xl border border-zinc-300 bg-white/85 p-4 dark:border-zinc-700 dark:bg-zinc-950/70">
                <div className="mb-3" />
                <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Başlık, etiket, model veya içerikte ara"
                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-amber-300 transition focus:ring-2 sm:max-w-md dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  />
                  <Link
                    href="#one-cikanlar"
                    className="whitespace-nowrap rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Promptları Keşfet
                  </Link>
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                    >
                      Temizle
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-zinc-200 bg-white/85 p-4 dark:border-zinc-700 dark:bg-zinc-950/70">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {quickFilters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSearch(filter)}
                      className="w-full rounded-full border border-zinc-300 bg-white/80 px-3 py-1 text-center text-xs font-semibold text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-300"
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="mb-14">
            <div className="mb-6">
              <div className="mb-2 h-8 w-56 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-80 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <PromptCardSkeleton key={index} />
              ))}
            </div>
          </section>
        ) : error ? (
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
