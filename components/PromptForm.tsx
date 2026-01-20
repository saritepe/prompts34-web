'use client';

import { useState } from 'react';
import { PromptCreate, PromptUpdate } from '@/types/prompt';

interface PromptFormProps {
  initialData?: PromptUpdate & { title?: string; content?: string };
  onSubmit: (data: PromptCreate | PromptUpdate) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export default function PromptForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Kaydet',
}: PromptFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    tags: initialData?.tags?.join(', ') || '',
    explanation: initialData?.explanation || '',
    suggested_model: initialData?.suggested_model || '',
    is_public: initialData?.is_public ?? false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const data: PromptCreate | PromptUpdate = {
        title: formData.title || undefined,
        content: formData.content || undefined,
        tags: tags.length > 0 ? tags : undefined,
        explanation: formData.explanation || null,
        suggested_model: formData.suggested_model || null,
        is_public: formData.is_public,
      };

      await onSubmit(data);

      // Reset form if this was a create operation
      if (!initialData) {
        setFormData({
          title: '',
          content: '',
          tags: '',
          explanation: '',
          suggested_model: '',
          is_public: false,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">
          Başlık *
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent"
          placeholder="Promptunuza bir başlık verin"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">
          Prompt İçeriği *
        </label>
        <textarea
          id="content"
          required
          rows={8}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent font-mono text-sm"
          placeholder="Prompt içeriğinizi buraya yazın..."
        />
      </div>

      <div>
        <label htmlFor="explanation" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">
          Açıklama
        </label>
        <textarea
          id="explanation"
          rows={3}
          value={formData.explanation}
          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent"
          placeholder="Bu promptun ne işe yaradığını açıklayın"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">
          Etiketler
        </label>
        <input
          type="text"
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent"
          placeholder="Etiketleri virgülle ayırarak yazın (örn: yazma, kod, analiz)"
        />
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
          Etiketleri virgülle ayırarak yazın
        </p>
      </div>

      <div>
        <label htmlFor="suggested_model" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">
          Önerilen Model
        </label>
        <input
          type="text"
          id="suggested_model"
          value={formData.suggested_model}
          onChange={(e) => setFormData({ ...formData, suggested_model: e.target.value })}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent"
          placeholder="örn: GPT-4, Claude, Gemini"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_public"
          checked={formData.is_public}
          onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
          className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 focus:ring-zinc-900 dark:focus:ring-zinc-50"
        />
        <label htmlFor="is_public" className="ml-2 block text-sm text-zinc-900 dark:text-zinc-50">
          Bu promptu halka açık yap (Diğer kullanıcılar görebilir)
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 text-sm font-medium rounded-md bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Kaydediliyor...' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 text-sm font-medium rounded-md border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            İptal
          </button>
        )}
      </div>
    </form>
  );
}
