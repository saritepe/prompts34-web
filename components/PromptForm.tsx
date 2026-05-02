'use client';

import { useRef, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { uploadPromptImage } from '@/lib/api/prompts';
import { compressImage } from '@/lib/utils/compress-image';
import PromptOutputImage from '@/components/PromptOutputImage';
import {
  PromptCreate,
  PromptOutput,
  PromptUpdate,
  PromptResponse,
} from '@/types/prompt';

type OutputKind = '' | 'text' | 'image';

const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_INPUT_BYTES = 25 * 1024 * 1024;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

type PromptFormData = Partial<PromptResponse>;

interface PromptFormProps {
  initialData?: PromptFormData;
  onSubmit:
    | ((data: PromptCreate) => Promise<void>)
    | ((data: PromptUpdate) => Promise<void>);
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
    output_type: (initialData?.output?.type ?? '') as OutputKind,
    output_value: initialData?.output?.value ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token } = useAuth();

  async function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploadError(null);

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setUploadError('Sadece PNG, JPEG veya WebP yükleyebilirsiniz.');
      return;
    }
    if (file.size > MAX_INPUT_BYTES) {
      setUploadError(
        `Görsel en fazla ${MAX_INPUT_BYTES / (1024 * 1024)} MB olabilir.`,
      );
      return;
    }
    if (!token) {
      setUploadError('Yükleme için giriş yapmış olmanız gerekiyor.');
      return;
    }

    setUploading(true);
    try {
      const compressed = await compressImage(file);
      if (compressed.size > MAX_UPLOAD_BYTES) {
        throw new Error(
          'Görsel sıkıştırıldıktan sonra hâlâ çok büyük. Daha küçük bir görsel deneyin.',
        );
      }
      const url = await uploadPromptImage(compressed, token);
      setFormData((prev) => ({ ...prev, output_value: url }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Görsel yüklenemedi');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const tags = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const trimmedOutput = formData.output_value.trim();
      const output: PromptOutput | null =
        formData.output_type && trimmedOutput
          ? formData.output_type === 'image'
            ? { type: 'image', value: trimmedOutput }
            : { type: 'text', value: formData.output_value }
          : null;

      // If we have initialData, we're updating, otherwise creating
      if (initialData) {
        const updateData: PromptUpdate = {
          title: formData.title || null,
          content: formData.content || null,
          tags: tags.length > 0 ? tags : null,
          explanation: formData.explanation || null,
          suggested_model: formData.suggested_model || null,
          is_public: formData.is_public,
          output,
        };
        await (onSubmit as (data: PromptUpdate) => Promise<void>)(updateData);
      } else {
        const createData: PromptCreate = {
          title: formData.title,
          content: formData.content,
          tags: tags,
          explanation: formData.explanation || null,
          suggested_model: formData.suggested_model || null,
          is_public: formData.is_public,
          output,
        };
        await (onSubmit as (data: PromptCreate) => Promise<void>)(createData);
      }

      // Reset form if this was a create operation
      if (!initialData) {
        setFormData({
          title: '',
          content: '',
          tags: '',
          explanation: '',
          suggested_model: '',
          is_public: false,
          output_type: '',
          output_value: '',
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
        <label
          htmlFor="title"
          className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2"
        >
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
        <label
          htmlFor="content"
          className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2"
        >
          Prompt İçeriği *
        </label>
        <textarea
          id="content"
          required
          rows={8}
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent font-mono text-sm"
          placeholder="Prompt içeriğinizi buraya yazın..."
        />
      </div>

      <div>
        <label
          htmlFor="explanation"
          className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2"
        >
          Açıklama
        </label>
        <textarea
          id="explanation"
          rows={3}
          value={formData.explanation}
          onChange={(e) =>
            setFormData({ ...formData, explanation: e.target.value })
          }
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent"
          placeholder="Bu promptun ne işe yaradığını açıklayın"
        />
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2"
        >
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
        <label
          htmlFor="suggested_model"
          className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2"
        >
          Önerilen Model
        </label>
        <input
          type="text"
          id="suggested_model"
          value={formData.suggested_model}
          onChange={(e) =>
            setFormData({ ...formData, suggested_model: e.target.value })
          }
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent"
          placeholder="örn: GPT-4, Claude, Gemini"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">
          Çıktı (opsiyonel)
        </label>
        <div className="flex gap-2 mb-3">
          {(
            [
              { value: '', label: 'Yok' },
              { value: 'text', label: 'Metin' },
              { value: 'image', label: 'Görsel' },
            ] as { value: OutputKind; label: string }[]
          ).map((opt) => (
            <button
              key={opt.value || 'none'}
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  output_type: opt.value,
                  output_value: opt.value === '' ? '' : formData.output_value,
                })
              }
              className={`px-3 py-1.5 text-sm rounded-md border ${
                formData.output_type === opt.value
                  ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 dark:border-zinc-50'
                  : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {formData.output_type === 'text' && (
          <textarea
            rows={6}
            value={formData.output_value}
            onChange={(e) =>
              setFormData({ ...formData, output_value: e.target.value })
            }
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent font-mono text-sm"
            placeholder="Promptu çalıştırınca dönen metin sonucunu yapıştırın"
          />
        )}
        {formData.output_type === 'image' && (
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              onChange={handleImageFileChange}
              disabled={uploading}
              className="block w-full text-sm text-zinc-700 dark:text-zinc-300 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white dark:file:bg-zinc-50 dark:file:text-zinc-900 disabled:opacity-50"
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              PNG, JPEG veya WebP. En fazla {MAX_INPUT_BYTES / (1024 * 1024)}{' '}
              MB. Görsel tarayıcıda otomatik sıkıştırılır ve WebP olarak
              depolanır.
            </p>
            {uploading && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Sıkıştırılıyor ve yükleniyor...
              </p>
            )}
            {uploadError && (
              <div
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
              >
                {uploadError}
              </div>
            )}
            {formData.output_value && !uploading && (
              <div className="space-y-2">
                <PromptOutputImage
                  src={formData.output_value}
                  alt="Çıktı önizleme"
                  className="max-h-64 rounded-md border border-zinc-200 dark:border-zinc-800"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-zinc-600 underline underline-offset-2 dark:text-zinc-400"
                  >
                    Değiştir
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, output_value: '' }))
                    }
                    className="text-xs text-red-600 underline underline-offset-2 dark:text-red-400"
                  >
                    Kaldır
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_public"
          checked={formData.is_public}
          onChange={(e) =>
            setFormData({ ...formData, is_public: e.target.checked })
          }
          className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 focus:ring-zinc-900 dark:focus:ring-zinc-50"
        />
        <label
          htmlFor="is_public"
          className="ml-2 block text-sm text-zinc-900 dark:text-zinc-50"
        >
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
