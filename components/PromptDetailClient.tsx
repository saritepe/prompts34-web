'use client';

import { useEffect, useRef, useState } from 'react';
import Navigation from '@/components/Navigation';
import CopyContentButton from '@/components/CopyContentButton';
import PromptVoteButton from '@/components/PromptVoteButton';
import CommentSection from '@/components/CommentSection';
import PromptForm from '@/components/PromptForm';
import PromptOutputImage from '@/components/PromptOutputImage';
import { useAuth } from '@/lib/auth';
import { updatePrompt } from '@/lib/api/prompts';
import type { PromptResponse, PromptUpdate } from '@/types/prompt';

interface PromptDetailClientProps {
  prompt: PromptResponse;
}

export default function PromptDetailClient({
  prompt: initialPrompt,
}: PromptDetailClientProps) {
  const { user, token } = useAuth();
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isEditing, setIsEditing] = useState(false);
  const editSectionRef = useRef<HTMLDivElement | null>(null);
  const isOwner = Boolean(token && user?.id && user.id === prompt.user_id);

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

          {prompt.output && (
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
