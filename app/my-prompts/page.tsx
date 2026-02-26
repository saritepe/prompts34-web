'use client';

import { useAuth } from '@/lib/auth';
import { useCallback, useEffect, useState } from 'react';
import { getMyPrompts, deletePrompt, createPrompt, updatePrompt } from '@/lib/api/prompts';
import { PromptResponse, PromptCreate, PromptUpdate } from '@/types/prompt';
import { useRouter } from 'next/navigation';
import PromptForm from '@/components/PromptForm';
import Navigation from '@/components/Navigation';

export default function MyPromptsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [prompts, setPrompts] = useState<PromptResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<PromptResponse | null>(null);

  const fetchPrompts = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const data = await getMyPrompts(token);
      setPrompts(data);
    } catch (err) {
      setError('Promptlar yüklenirken bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!user) {
      router.push('/giris');
      return;
    }

    fetchPrompts();
  }, [user, router, fetchPrompts]);

  async function handleDelete(promptId: string) {
    if (!token) return;
    if (!confirm('Bu promptu silmek istediğinize emin misiniz?')) return;

    try {
      await deletePrompt(promptId, token);
      setPrompts(prompts.filter(p => p.id !== promptId));
    } catch (err) {
      alert('Prompt silinirken bir hata oluştu');
      console.error(err);
    }
  }

  async function handleCreate(data: PromptCreate) {
    if (!token) return;

    const newPrompt = await createPrompt(data, token);
    setPrompts([newPrompt, ...prompts]);
    setShowCreateForm(false);
  }

  async function handleUpdate(data: PromptUpdate) {
    if (!token || !editingPrompt) return;

    const updatedPrompt = await updatePrompt(editingPrompt.id, data, token);
    setPrompts(prompts.map(p => p.id === updatedPrompt.id ? updatedPrompt : p));
    setEditingPrompt(null);
  }

  function handleEdit(prompt: PromptResponse) {
    setEditingPrompt(prompt);
    setShowCreateForm(false);
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              Promptlarım
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Oluşturduğunuz promptları yönetin
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 text-sm font-medium rounded-md bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            {showCreateForm ? 'İptal' : 'Yeni Prompt'}
          </button>
        </div>

        {showCreateForm && (
          <div className="mb-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
              Yeni Prompt Oluştur
            </h2>
            <PromptForm
              onSubmit={handleCreate}
              onCancel={() => setShowCreateForm(false)}
              submitLabel="Oluştur"
            />
          </div>
        )}

        {editingPrompt && (
          <div className="mb-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
              Prompt Düzenle
            </h2>
            <PromptForm
              initialData={editingPrompt}
              onSubmit={handleUpdate}
              onCancel={() => setEditingPrompt(null)}
              submitLabel="Güncelle"
            />
          </div>
        )}

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
            <p className="text-zinc-600 dark:text-zinc-400">
              Henüz prompt oluşturmadınız. Yeni bir prompt oluşturmak için yukarıdaki butona tıklayın.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <div
                key={prompt.id}
                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                      {prompt.title}
                    </h3>
                    {(prompt.username || user?.username) && (
                      <span className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                        @{prompt.username || user?.username}
                      </span>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${
                    prompt.is_public
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}>
                    {prompt.is_public ? 'Halka Açık' : 'Özel'}
                  </span>
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

                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mb-4">
                  <pre className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap font-mono bg-zinc-50 dark:bg-zinc-900 p-3 rounded max-h-48 overflow-y-auto">
                    {prompt.content}
                  </pre>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500 dark:text-zinc-500">
                    {new Date(prompt.created_at).toLocaleDateString('tr-TR')}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(prompt)}
                      className="px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 border border-zinc-300 dark:border-zinc-700 rounded"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(prompt.id)}
                      className="px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 border border-red-300 dark:border-red-700 rounded"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
