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
  FAQPageStructuredData,
  HowToStructuredData,
} from '@/app/components/StructuredData';
import {
  getAllGuideSlugs,
  getGuideBySlug,
  getGuidePath,
  GUIDES,
} from '@/lib/guides';
import { getGlossaryBySlug, getGlossaryPath } from '@/lib/glossary';
import { getTopicBySlug, getTopicPath } from '@/lib/topics';
import { TOOL_HUBS } from '@/lib/tool-hubs';

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

interface RehberPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: RehberPageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  const url = `https://prompts34.com${getGuidePath(guide)}`;

  return {
    title: guide.title,
    description: guide.shortDescription,
    keywords: guide.keywords,
    openGraph: {
      title: `${guide.title} | Prompts34`,
      description: guide.shortDescription,
      type: 'article',
      url,
      siteName: 'Prompts34',
      locale: 'tr_TR',
      ...sharedOpenGraphImage,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${guide.title} | Prompts34`,
      description: guide.shortDescription,
      ...sharedTwitterImage,
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export default async function RehberDetailPage({ params }: RehberPageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const canonicalUrl = `https://prompts34.com${getGuidePath(guide)}`;

  const relatedTopics = (guide.relatedTopicSlugs ?? [])
    .map((s) => getTopicBySlug(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
  const relatedHubs = (guide.relatedToolHubSlugs ?? [])
    .map((s) => TOOL_HUBS.find((h) => h.slug === s))
    .filter((h): h is NonNullable<typeof h> => Boolean(h));
  const relatedGlossary = (guide.relatedGlossarySlugs ?? [])
    .map((s) => getGlossaryBySlug(s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));
  const otherGuides = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <BreadcrumbStructuredData
        items={[
          { name: 'Ana Sayfa', url: 'https://prompts34.com' },
          { name: 'Rehber', url: 'https://prompts34.com/rehber' },
          { name: guide.title, url: canonicalUrl },
        ]}
      />
      <HowToStructuredData
        name={guide.title}
        description={guide.shortDescription}
        url={canonicalUrl}
        steps={guide.steps.map((s) => ({ name: s.name, text: s.body }))}
        datePublished={guide.datePublished}
        dateModified={guide.dateModified}
      />
      {guide.faqs && guide.faqs.length > 0 && (
        <FAQPageStructuredData
          questions={guide.faqs.map((f) => ({
            question: f.question,
            answer: f.answer,
          }))}
        />
      )}
      <Navigation />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/rehber" className="hover:underline">
            Rehber
          </Link>{' '}
          <span aria-hidden="true">›</span>{' '}
          <span aria-current="page">{guide.title}</span>
        </nav>

        <article>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            {guide.title}
          </h1>
          {guide.dateModified && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Son güncelleme:{' '}
              <time dateTime={guide.dateModified}>{guide.dateModified}</time>
            </p>
          )}
          <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-8">
            {guide.intro}
          </p>

          <nav
            aria-label="Rehber içindekiler"
            className="mb-10 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-3">
              İçindekiler
            </h2>
            <ol className="list-decimal pl-5 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
              {guide.steps.map((step, index) => (
                <li key={step.name}>
                  <a href={`#adim-${index + 1}`} className="hover:underline">
                    {step.name}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <ol className="space-y-8">
            {guide.steps.map((step, index) => (
              <li
                key={step.name}
                className="border-l-4 border-zinc-300 pl-6 dark:border-zinc-700"
              >
                <h2
                  id={`adim-${index + 1}`}
                  className="scroll-mt-20 text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2"
                >
                  {index + 1}. {step.name}
                </h2>
                <p className="text-base leading-7 text-zinc-700 dark:text-zinc-300">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-base leading-7 text-zinc-700 dark:text-zinc-300">
            {guide.conclusion}
          </p>

          {guide.faqs && guide.faqs.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Sıkça sorulan sorular
              </h2>
              <div className="space-y-4">
                {guide.faqs.map((faq, idx) => (
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

        {(relatedHubs.length > 0 || relatedTopics.length > 0) && (
          <section className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              İlgili kategoriler ve araçlar
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedHubs.map((hub) => (
                <Link
                  key={hub.slug}
                  href={hub.canonicalPath}
                  className="rounded-full border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  {hub.title}
                </Link>
              ))}
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

        {relatedGlossary.length > 0 && (
          <section className="mt-10 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              Sözlükten ilgili terimler
            </h2>
            <ul className="space-y-2">
              {relatedGlossary.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={getGlossaryPath(entry)}
                    className="text-zinc-900 dark:text-zinc-100 hover:underline"
                  >
                    {entry.term}
                  </Link>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {' '}
                    — {entry.shortDefinition}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Diğer rehberler
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherGuides.map((other) => (
              <Link
                key={other.slug}
                href={getGuidePath(other)}
                className="block rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
              >
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {other.title}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
