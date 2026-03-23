'use client';

import { useState } from 'react';
import { votePrompt } from '@/lib/api/prompts';
import { useAuth } from '@/lib/auth';

interface PromptVoteButtonProps {
  promptId: string;
  initialLikeCount: number;
  initialLikedByMe: boolean;
}

export default function PromptVoteButton({
  promptId,
  initialLikeCount,
  initialLikedByMe,
}: PromptVoteButtonProps) {
  const { token } = useAuth();
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [liked, setLiked] = useState(initialLikedByMe);
  const [loading, setLoading] = useState(false);

  async function handleVote() {
    if (!token) {
      alert('Beğenmek için giriş yapmalısınız.');
      return;
    }

    try {
      setLoading(true);
      const result = await votePrompt(promptId, token);
      setLikeCount(result.like_count);
      setLiked(result.liked);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Oylama sırasında hata oluştu';
      alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-semibold transition ${
        liked
          ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200'
          : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
      }`}
      aria-label="Promptu beğen"
    >
      👍 {likeCount}
    </button>
  );
}
