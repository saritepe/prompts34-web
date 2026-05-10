'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import CopyContentButton from '@/components/CopyContentButton';
import PromptVoteButton from '@/components/PromptVoteButton';
import CommentSection from '@/components/CommentSection';
import PromptForm from '@/components/PromptForm';
import PromptOutputImage from '@/components/PromptOutputImage';
import { useAuth } from '@/lib/auth';
import { getPrompt, updatePrompt } from '@/lib/api/prompts';
import type { PromptResponse, PromptUpdate } from '@/types/prompt';

interface PromptDetailClientProps {
  prompt: PromptResponse;
}

export default function PromptDetailClient({
  prompt: initialPrompt,
}: PromptDetailClientProps) {
  const { user, token, loading } = useAuth();
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isEditing, setIsEditing] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const editSectionRef = useRef<HTMLDivElement | null>(null);
  const isOwner = Boolean(token && user?.id && user.id === prompt.user_id);
  const hasPromptDetails = Boolean(prompt.content);
  const isFetchingDetails = Boolean(
    token && !hasPromptDetails && !detailsError,
  );

  useEffect(() => {
    if (!isEditing || !editSectionRef.current) {
      return;
    }

    editSectionRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    const firstField = editSectionRef.current.querySelector<
      HTMLInputElement | HTMLTextAreaElement
    >('input, textarea');
    firstField?.focus();
  }, [isEditing]);

  useEffect(() => {
    if (!token || hasPromptDetails) {
      return;
    }

    let isCurrent = true;

    getPrompt(initialPrompt.id, token)
      .then((fullPrompt) => {
        if (isCurrent) {
          setPrompt(fullPrompt);
          setDetailsError('');
        }
      })
      .catch(() => {
        if (isCurrent) {
          setDetailsError('Prompt detayları yüklenemedi.');
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [hasPromptDetails, initialPrompt.id, token]);

  async function handleUpdate(data: PromptUpdate) {
    if (!token) return;

    const updatedPrompt = await updatePrompt(prompt.id, data, token);
    setPrompt(updatedPrompt);
    setIsEditing(false);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Navigation />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {isEditing && (
          <section
            ref={editSectionRef}
            className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Prompt Düzenle
            </h2>
            <PromptForm
              initialData={prompt}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
              submitLabel="Güncelle"
            />
          </section>
        )}

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              {isOwner && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  Düzenle
                </button>
              )}
              <PromptVoteButton
                promptId={prompt.id}
                initialLikeCount={prompt.like_count}
                initialLikedByMe={prompt.liked_by_me}
              />
            </div>
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

          {loading || isFetchingDetails ? (
            <PromptDetailsLoading />
          ) : hasPromptDetails ? (
            <div className="mb-8 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  İçerik
                </h2>
                <CopyContentButton
                  content={prompt.content}
                  promptId={prompt.id}
                  firstTag={prompt.tags[0]}
                />
              </div>
              <pre className="whitespace-pre-wrap text-[8pt] leading-6 text-zinc-800 dark:text-zinc-200">
                {prompt.content}
              </pre>
            </div>
          ) : (
            <PromptAccessGate
              commentCount={prompt.comment_count}
              error={detailsError}
              likeCount={prompt.like_count}
              promptTitle={prompt.title}
              tagCount={prompt.tags.length}
            />
          )}

          {hasPromptDetails && prompt.output && (
            <div className="mb-8 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Sonuç
              </h2>
              {prompt.output.type === 'text' ? (
                <pre className="whitespace-pre-wrap text-[8pt] leading-6 text-zinc-800 dark:text-zinc-200">
                  {prompt.output.value}
                </pre>
              ) : (
                <PromptOutputImage
                  src={prompt.output.value}
                  alt={prompt.title}
                  className="max-h-[600px] rounded-md border border-zinc-200 dark:border-zinc-800"
                />
              )}
            </div>
          )}

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

function PromptDetailsLoading() {
  return (
    <div className="mb-8 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 h-7 w-28 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="space-y-3">
        <div className="h-4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

function PromptAccessGate({
  commentCount,
  error,
  likeCount,
  promptTitle,
  tagCount,
}: {
  commentCount: number;
  error: string;
  likeCount: number;
  promptTitle: string;
  tagCount: number;
}) {
  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-100 via-orange-50 to-amber-50 p-6 text-center shadow-[0_18px_45px_rgba(180,83,9,0.18)] dark:border-amber-900/50 dark:from-amber-950/30 dark:via-zinc-950 dark:to-orange-950/20 sm:p-8">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/20">
        <svg
          aria-hidden="true"
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="m4.5 19.5 15-15M7 5h.01M11 3h.01M3 9h.01M15 13h.01M19 17h.01M13 21h.01M19 3l2 2-7 7-2-2 7-7Z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </div>

      <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 sm:text-3xl">
        Bu Prompt Seni Bekliyor
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-base font-medium text-zinc-700 dark:text-zinc-300 sm:text-lg">
        {promptTitle} promptunu kopyalamak ve kullanmak için ücretsiz üye ol.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
        <span>{likeCount.toLocaleString('tr-TR')} beğeni</span>
        <span>{commentCount.toLocaleString('tr-TR')} yorum</span>
        <span>{tagCount.toLocaleString('tr-TR')} etiket</span>
        <span>Ücretsiz üyelik</span>
      </div>

      {error && (
        <p className="mx-auto mt-5 max-w-xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}

      <div className="mx-auto mt-7 grid max-w-2xl gap-3 sm:grid-cols-2">
        <Link
          href="/giris"
          className="rounded-xl bg-zinc-900 px-5 py-4 text-sm font-bold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Giriş Yap
        </Link>
        <Link
          href="/kayit"
          className="rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:from-amber-700 hover:to-orange-600"
        >
          Kayıt Ol
        </Link>
      </div>

      <p className="mt-5 text-sm text-zinc-500 dark:text-zinc-500">
        10 saniyede üye ol, binlerce promptu keşfet.
      </p>
    </div>
  );
}
