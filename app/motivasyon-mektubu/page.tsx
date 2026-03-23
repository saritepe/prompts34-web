import { Metadata } from 'next';
import { getPromptsByTags } from '@/lib/api/prompts';
import { PromptResponse } from '@/types/prompt';
import Navigation from '@/components/Navigation';
import {
  BreadcrumbStructuredData,
  CollectionPageStructuredData,
} from '../components/StructuredData';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Motivasyon Mektubu Promptları',
  description:
    'Etkili motivasyon mektubu yazmak için yapay zeka promptları. ChatGPT ve AI araçları ile profesyonel başvuru mektupları oluşturun.',
  keywords: [
    'motivasyon mektubu',
    'başvuru mektubu',
    'cover letter',
    'ai mektup',
    'chatgpt motivasyon mektubu',
  ],
  openGraph: {
    title: 'Motivasyon Mektubu Promptları | Prompts34',
    description: 'Etkili motivasyon mektubu yazmak için yapay zeka promptları',
    type: 'website',
    url: 'https://prompts34.com/motivasyon-mektubu',
    siteName: 'Prompts34',
    locale: 'tr_TR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Motivasyon Mektubu Promptları | Prompts34',
    description: 'Etkili motivasyon mektubu yazmak için yapay zeka promptları',
  },
  alternates: {
    canonical: 'https://prompts34.com/motivasyon-mektubu',
  },
};

export default async function MotivasyonMektubuPage() {
  let prompts: PromptResponse[] = [];
  let error: string | null = null;

  try {
    prompts = await getPromptsByTags(['motivasyon-mektubu']);
  } catch (err) {
    error = 'Promptlar yüklenirken bir hata oluştu';
    console.error(err);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <BreadcrumbStructuredData
        items={[
          { name: 'Ana Sayfa', url: 'https://prompts34.com' },
          {
            name: 'Motivasyon Mektubu',
            url: 'https://prompts34.com/motivasyon-mektubu',
          },
        ]}
      />
      <CollectionPageStructuredData
        name="Motivasyon Mektubu Promptları"
        description="Etkili motivasyon mektubu yazmak için yapay zeka promptları"
        url="https://prompts34.com/motivasyon-mektubu"
      />
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Motivasyon Mektubu Promptları
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
            Yapay zeka ile etkili motivasyon mektubu ve başvuru mektubu
            hazırlayın. ChatGPT, Claude ve diğer AI araçları kullanarak dikkat
            çekici mektuplar yazın.
          </p>
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3">
              Motivasyon Mektubu İpuçları
            </h2>
            <ul className="list-disc list-inside space-y-2 text-green-800 dark:text-green-200">
              <li>Pozisyona ve şirkete özel içerik hazırlayın</li>
              <li>Neden bu pozisyon için uygun olduğunuzu açıklayın</li>
              <li>Başarılarınızı ve deneyimlerinizi vurgulayın</li>
              <li>Profesyonel ama samimi bir dil kullanın</li>
              <li>Mektubunuzu kısa ve öz tutun (1 sayfa)</li>
            </ul>
          </div>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">
              Henüz motivasyon mektubu ile ilgili prompt bulunmuyor.
            </p>
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
