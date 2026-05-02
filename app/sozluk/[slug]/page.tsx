import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  sharedOpenGraphImage,
  sharedTwitterImage,
} from '@/app/shared-metadata';
import Navigation from '@/components/Navigation';
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
  DefinedTermStructuredData,
  FAQPageStructuredData,
} from '@/app/components/StructuredData';
import {
  getAllGlossarySlugs,
  getGlossaryBySlug,
  getGlossaryPath,
  getRelatedGlossaryEntries,
} from '@/lib/glossary';
import { getGuideBySlug, getGuidePath } from '@/lib/guides';
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
  const bodyParagraphs = entry.body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const relatedTopics = (entry.relatedTopicSlugs ?? [])
    .map((s) => getTopicBySlug(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
  const relatedGuides = (entry.relatedGuideSlugs ?? [])
    .map((s) => getGuideBySlug(s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));
  const relatedEntries = getRelatedGlossaryEntries(entry, 6);

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
        alternateName={entry.alternateNames}
      />
      {entry.datePublished && (
        <ArticleStructuredData
          headline={entry.term}
          description={entry.shortDefinition}
          url={canonicalUrl}
          datePublished={entry.datePublished}
          dateModified={entry.dateModified}
        />
      )}
      {entry.faqs && entry.faqs.length > 0 && (
        <FAQPageStructuredData
          questions={entry.faqs.map((f) => ({
            question: f.question,
            answer: f.answer,
          }))}
        />
      )}
      <Navigation />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/sozluk" className="hover:underline">
            Sözlük
          </Link>{' '}
          <span aria-hidden="true">›</span>{' '}
          <span aria-current="page">{entry.term}</span>
        </nav>

        <article>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            {entry.term}
          </h1>
          {entry.alternateNames && entry.alternateNames.length > 0 && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              <span className="font-medium">Alternatif isimler:</span>{' '}
              {entry.alternateNames.join(', ')}
            </p>
          )}
          <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-6 font-medium">
            {entry.shortDefinition}
          </p>
          <div className="prose prose-zinc dark:prose-invert max-w-none text-base leading-7 text-zinc-700 dark:text-zinc-300">
            {bodyParagraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {entry.example && (
            <section className="mt-10">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                Örnek prompt
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                {entry.example.title}
              </p>
              <pre className="whitespace-pre-wrap rounded-lg border border-zinc-200 bg-white p-4 text-sm leading-6 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
                {entry.example.prompt}
              </pre>
            </section>
          )}

          {entry.pitfalls && entry.pitfalls.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                Sık yapılan hatalar
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
                {entry.pitfalls.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </section>
          )}

          {entry.faqs && entry.faqs.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Sıkça sorulan sorular
              </h2>
              <div className="space-y-4">
                {entry.faqs.map((faq, idx) => (
                  <details
                    key={idx}
                    className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <summary className="cursor-pointer font-medium text-zinc-900 dark:text-zinc-50">
                      {faq.question}
                    </summary>
                    <p className="mt-2 text-zinc-700 dark:text-zinc-300">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </article>

        {relatedGuides.length > 0 && (
          <section className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              İlgili rehberler
            </h2>
            <ul className="space-y-2">
              {relatedGuides.map((guide) => (
                <li key={guide.slug}>
                  <Link
                    href={getGuidePath(guide)}
                    className="text-zinc-900 dark:text-zinc-100 hover:underline"
                  >
                    {guide.title}
                  </Link>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {' '}
                    — {guide.shortDescription}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

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
            Sözlükte ilgili terimler
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
                <span className="mt-1 block text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                  {other.shortDefinition}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
