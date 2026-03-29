import { Metadata } from 'next';
import {
  sharedOpenGraphImage,
  sharedTwitterImage,
} from '@/app/shared-metadata';
import { getPromptsByTags } from '@/lib/api/prompts';
import { PromptResponse } from '@/types/prompt';
import CategoryPromptCard from '@/components/CategoryPromptCard';
import Navigation from '@/components/Navigation';
import {
  BreadcrumbStructuredData,
  CollectionPageStructuredData,
} from '../components/StructuredData';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'CV Hazırlama Promptları',
  description:
    'Profesyonel CV ve özgeçmiş hazırlamak için yapay zeka promptları. ChatGPT, Claude ve diğer AI araçları ile etkili CV oluşturun.',
  keywords: [
    'cv hazırlama',
    'özgeçmiş',
    'cv promptları',
    'ai cv',
    'chatgpt cv',
    'yapay zeka cv',
  ],
  openGraph: {
    title: 'CV Hazırlama Promptları | Prompts34',
    description:
      'Profesyonel CV ve özgeçmiş hazırlamak için yapay zeka promptları',
    type: 'website',
    url: 'https://prompts34.com/cv-hazirlama',
    siteName: 'Prompts34',
    locale: 'tr_TR',
    ...sharedOpenGraphImage,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CV Hazırlama Promptları | Prompts34',
    description:
      'Profesyonel CV ve özgeçmiş hazırlamak için yapay zeka promptları',
    ...sharedTwitterImage,
  },
  alternates: {
    canonical: 'https://prompts34.com/cv-hazirlama',
  },
};

export default async function CVHazirlamaPage() {
  let prompts: PromptResponse[] = [];
  let error: string | null = null;

  try {
    prompts = await getPromptsByTags(['cv']);
  } catch (err) {
    error = 'Promptlar yüklenirken bir hata oluştu';
    console.error(err);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <BreadcrumbStructuredData
        items={[
          { name: 'Ana Sayfa', url: 'https://prompts34.com' },
          { name: 'CV Hazırlama', url: 'https://prompts34.com/cv-hazirlama' },
        ]}
      />
      <CollectionPageStructuredData
        name="CV Hazırlama Promptları"
        description="Profesyonel CV ve özgeçmiş hazırlamak için yapay zeka promptları"
        url="https://prompts34.com/cv-hazirlama"
      />
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            CV Hazırlama Promptları
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
            Yapay zeka ile profesyonel CV ve özgeçmiş hazırlamak için
            hazırlanmış promptlar. ChatGPT, Claude ve diğer AI araçları
            kullanarak etkili özgeçmişler oluşturun.
          </p>
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">
              CV Hazırlama İpuçları
            </h2>
            <ul className="list-disc list-inside space-y-2 text-blue-800 dark:text-blue-200">
              <li>Hedef pozisyona uygun anahtar kelimeler kullanın</li>
              <li>Başarılarınızı somut rakamlarla destekleyin</li>
              <li>Kısa ve öz cümleler tercih edin</li>
              <li>Profesyonel bir format ve tasarım kullanın</li>
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
              Henüz CV hazırlama ile ilgili prompt bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <CategoryPromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
