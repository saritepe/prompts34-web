import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  sharedOpenGraphImage,
  sharedTwitterImage,
} from '@/app/shared-metadata';
import Navigation from '@/components/Navigation';
import {
  BreadcrumbStructuredData,
  DefinedTermStructuredData,
} from '@/app/components/StructuredData';
import {
  GLOSSARY,
  getAllGlossarySlugs,
  getGlossaryBySlug,
  getGlossaryPath,
} from '@/lib/glossary';
import { getTopicBySlug, getTopicPath } from '@/lib/topics';

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllGlossarySlugs().map((slug) => ({ slug }));
}

interface SozlukPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: SozlukPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getGlossaryBySlug(slug);
  if (!entry) return {};

  const url = `https://prompts34.com${getGlossaryPath(entry)}`;

  return {
    title: `${entry.term} | Sözlük`,
    description: entry.shortDefinition,
    keywords: entry.keywords,
    openGraph: {
      title: `${entry.term} | Prompts34 Sözlük`,
      description: entry.shortDefinition,
      type: 'article',
      url,
      siteName: 'Prompts34',
      locale: 'tr_TR',
      ...sharedOpenGraphImage,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${entry.term} | Prompts34 Sözlük`,
      description: entry.shortDefinition,
      ...sharedTwitterImage,
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export default async function SozlukDetailPage({ params }: SozlukPageProps) {
  const { slug } = await params;
  const entry = getGlossaryBySlug(slug);
  if (!entry) notFound();

  const canonicalUrl = `https://prompts34.com${getGlossaryPath(entry)}`;
  const relatedTopics = (entry.relatedTopicSlugs ?? [])
    .map((s) => getTopicBySlug(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
  const relatedEntries = GLOSSARY.filter((g) => g.slug !== entry.slug).slice(
    0,
    6,
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <BreadcrumbStructuredData
        items={[
          { name: 'Ana Sayfa', url: 'https://prompts34.com' },
          { name: 'Sözlük', url: 'https://prompts34.com/sozluk' },
          { name: entry.term, url: canonicalUrl },
        ]}
      />
      <DefinedTermStructuredData
        term={entry.term}
        description={entry.shortDefinition}
        url={canonicalUrl}
      />
      <Navigation />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/sozluk" className="hover:underline">
            Sözlük
          </Link>{' '}
          <span>›</span> <span>{entry.term}</span>
        </nav>

        <article>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            {entry.term}
          </h1>
          <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-6 font-medium">
            {entry.shortDefinition}
          </p>
          <div className="prose prose-zinc dark:prose-invert max-w-none text-base leading-7 text-zinc-700 dark:text-zinc-300">
            <p>{entry.body}</p>
          </div>
        </article>

        {relatedTopics.length > 0 && (
          <section className="mt-10 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              İlgili kategoriler
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedTopics.map((topic) => (
                <Link
                  key={topic.slug}
                  href={getTopicPath(topic)}
                  className="rounded-full border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  {topic.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Sözlükte diğer terimler
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedEntries.map((other) => (
              <Link
                key={other.slug}
                href={getGlossaryPath(other)}
                className="block rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
              >
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {other.term}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
