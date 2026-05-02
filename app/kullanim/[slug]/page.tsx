import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  sharedOpenGraphImage,
  sharedTwitterImage,
} from '@/app/shared-metadata';
import { getPublicPrompts } from '@/lib/api/prompts';
import { PromptResponse } from '@/types/prompt';
import CategoryPromptCard from '@/components/CategoryPromptCard';
import Navigation from '@/components/Navigation';
import {
  BreadcrumbStructuredData,
  CollectionPageStructuredData,
} from '@/app/components/StructuredData';
import {
  getAllUseCaseSlugs,
  getUseCaseBySlug,
  getUseCasePath,
  matchPromptsForUseCase,
} from '@/lib/use-cases';

export const revalidate = 300;

export async function generateStaticParams() {
  return getAllUseCaseSlugs().map((slug) => ({ slug }));
}

interface KullanimPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: KullanimPageProps): Promise<Metadata> {
  const { slug } = await params;
  const useCase = getUseCaseBySlug(slug);
  if (!useCase) return {};

  const url = `https://prompts34.com${getUseCasePath(useCase)}`;

  return {
    title: `${useCase.title} | Prompts34`,
    description: useCase.description,
    keywords: useCase.keywords,
    openGraph: {
      title: `${useCase.title} | Prompts34`,
      description: useCase.description,
      type: 'website',
      url,
      siteName: 'Prompts34',
      locale: 'tr_TR',
      ...sharedOpenGraphImage,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${useCase.title} | Prompts34`,
      description: useCase.description,
      ...sharedTwitterImage,
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export default async function KullanimDetailPage({
  params,
}: KullanimPageProps) {
  const { slug } = await params;
  const useCase = getUseCaseBySlug(slug);
  if (!useCase) notFound();

  let prompts: PromptResponse[] = [];
  let error: string | null = null;

  try {
    const allPrompts = await getPublicPrompts();
    prompts = matchPromptsForUseCase(allPrompts, useCase);
  } catch (err) {
    error = 'Promptlar yüklenirken bir hata oluştu';
    console.error(err);
  }

  const canonicalUrl = `https://prompts34.com${getUseCasePath(useCase)}`;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <BreadcrumbStructuredData
        items={[
          { name: 'Ana Sayfa', url: 'https://prompts34.com' },
          { name: 'Kullanım Alanları', url: 'https://prompts34.com/kullanim' },
          { name: useCase.title, url: canonicalUrl },
        ]}
      />
      <CollectionPageStructuredData
        name={useCase.title}
        description={useCase.description}
        url={canonicalUrl}
      />
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            {useCase.title}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {useCase.description}
          </p>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">
              Bu kullanım alanı için henüz prompt bulunmuyor.
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
