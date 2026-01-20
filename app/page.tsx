'use client';

import { useEffect, useState } from 'react';
import { getPublicPrompts } from '@/lib/api/prompts';
import { PromptResponse } from '@/types/prompt';
import Navigation from '@/components/Navigation';

export default function Home() {
  const [prompts, setPrompts] = useState<PromptResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrompts() {
      try {
        setLoading(true);
        const data = await getPublicPrompts();
        setPrompts(data);
      } catch (err) {
        setError('Promptlar yüklenirken bir hata oluştu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPrompts();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Prompts34'e Hoş Geldiniz
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Topluluk tarafından paylaşılan promptları keşfedin
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">Yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">Henüz paylaşılan prompt yok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <div
                key={prompt.id}
                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    {prompt.title}
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
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
