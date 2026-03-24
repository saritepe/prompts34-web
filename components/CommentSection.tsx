'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { getComments, createComment, deleteComment } from '@/lib/api/comments';
import { CommentResponse } from '@/types/prompt';

interface CommentSectionProps {
  promptId: string;
  promptOwnerId: string;
  initialCommentCount: number;
}

export default function CommentSection({
  promptId,
  promptOwnerId,
  initialCommentCount,
}: CommentSectionProps) {
  const { user, token } = useAuth();
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getComments(promptId)
      .then(setComments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [promptId]);

  async function handleSubmit() {
    if (!token || !newComment.trim()) return;

    try {
      setSubmitting(true);
      const comment = await createComment(
        promptId,
        { content: newComment.trim() },
        token,
      );
      setComments((prev) => [...prev, comment]);
      setNewComment('');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Yorum gonderilemedi';
      alert(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(commentId: string) {
    if (!token) return;

    try {
      await deleteComment(promptId, commentId, token);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Yorum silinemedi';
      alert(message);
    }
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const canDelete = (comment: CommentResponse): boolean => {
    if (!user?.id) return false;
    return comment.user_id === user.id || promptOwnerId === user.id;
  };

  const commentCount = comments.length || initialCommentCount;

  return (
    <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
      <h3 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Yorumlar ({commentCount})
      </h3>

      {/* Comment list */}
      {loading ? (
        <div className="mb-4 space-y-3">
          {Array.from({ length: Math.min(initialCommentCount, 3) }).map(
            (_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl bg-zinc-100 p-4 dark:bg-zinc-900"
              >
                <div className="mb-2 h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            ),
          )}
        </div>
      ) : comments.length > 0 ? (
        <div className="mb-4 space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    @{comment.username || 'anonim'}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                {canDelete(comment) && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Sil
                  </button>
                )}
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-4 text-sm text-zinc-500">
          Henuz yorum yapilmamis. Ilk yorumu sen yap!
        </p>
      )}

      {/* Comment form */}
      {token ? (
        <>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Yorum yaz..."
            maxLength={2000}
            className="mb-3 min-h-28 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none ring-amber-300 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting || !newComment.trim()}
              className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {submitting ? 'Gonderiliyor...' : 'Yorum Gonder'}
            </button>
          </div>
        </>
      ) : (
        <p className="text-sm text-zinc-500">
          Yorum yapmak icin{' '}
          <a
            href="/giris"
            className="font-semibold text-zinc-900 underline dark:text-zinc-100"
          >
            giris yapin
          </a>
          .
        </p>
      )}
    </div>
  );
}
