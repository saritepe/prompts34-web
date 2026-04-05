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
} from '../../components/StructuredData';
import { getTopicBySlug, matchPromptsForTopic } from '../topic-pages';

export const dynamic = 'force-dynamic';

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    return {};
  }

  const url = `https://prompts34.com${topic.canonicalPath}`;

  return {
    title: topic.title,
    description: topic.description,
    openGraph: {
      title: `${topic.title} | Prompts34`,
      description: topic.description,
      type: 'website',
      url,
      siteName: 'Prompts34',
      locale: 'tr_TR',
      ...sharedOpenGraphImage,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${topic.title} | Prompts34`,
      description: topic.description,
      ...sharedTwitterImage,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  let prompts: PromptResponse[] = [];
  let error: string | null = null;

  try {
    const allPrompts = await getPublicPrompts();
    prompts = matchPromptsForTopic(allPrompts, topic);
  } catch (err) {
    error = 'Promptlar yüklenirken bir hata oluştu';
    console.error(err);
  }

  const canonicalUrl = `https://prompts34.com${topic.canonicalPath}`;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <BreadcrumbStructuredData
        items={[
          { name: 'Ana Sayfa', url: 'https://prompts34.com' },
          { name: 'Konular', url: 'https://prompts34.com/konular' },
          { name: topic.introHeading, url: canonicalUrl },
        ]}
      />
      <CollectionPageStructuredData
        name={topic.title}
        description={topic.description}
        url={canonicalUrl}
      />
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            {topic.introHeading}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
            {topic.introBody}
          </p>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">
              Bu konuda henüz prompt bulunmuyor.
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
