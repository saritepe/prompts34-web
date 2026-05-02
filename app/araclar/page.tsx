import { Metadata } from 'next';
import Link from 'next/link';
import {
  sharedOpenGraphImage,
  sharedTwitterImage,
} from '@/app/shared-metadata';
import Navigation from '@/components/Navigation';
import {
  BreadcrumbStructuredData,
  CollectionPageStructuredData,
} from '@/app/components/StructuredData';
import { TOOL_HUBS } from '@/lib/tool-hubs';

export const revalidate = false;

const CANONICAL_URL = 'https://prompts34.com/araclar';

export const metadata: Metadata = {
  title: 'Yapay Zeka Araçları için Türkçe Promptlar',
  description:
    "ChatGPT, Claude, Gemini ve Copilot için hazır Türkçe promptlar. Türkiye'nin en kapsamlı yapay zeka araç prompt kütüphanesi.",
  keywords: [
    'chatgpt promptları',
    'claude promptları',
    'gemini promptları',
    'copilot promptları',
    'yapay zeka araçları',
    'türkçe ai promptları',
  ],
  openGraph: {
    title: 'Yapay Zeka Araçları için Türkçe Promptlar | Prompts34',
    description:
      'ChatGPT, Claude, Gemini ve Copilot için hazır Türkçe promptlar.',
    type: 'website',
    url: CANONICAL_URL,
    siteName: 'Prompts34',
    locale: 'tr_TR',
    ...sharedOpenGraphImage,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yapay Zeka Araçları için Türkçe Promptlar | Prompts34',
    description:
      'ChatGPT, Claude, Gemini ve Copilot için hazır Türkçe promptlar.',
    ...sharedTwitterImage,
  },
  alternates: {
    canonical: CANONICAL_URL,
  },
};

const accentBorderMap: Record<string, string> = {
  blue: 'border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700',
  purple:
    'border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700',
  orange:
    'border-orange-200 dark:border-orange-800 hover:border-orange-300 dark:hover:border-orange-700',
  green:
    'border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700',
};

const accentTextMap: Record<string, string> = {
  blue: 'text-blue-600 dark:text-blue-400',
  purple: 'text-purple-600 dark:text-purple-400',
  orange: 'text-orange-600 dark:text-orange-400',
  green: 'text-green-600 dark:text-green-400',
};

export default function AraclarPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <BreadcrumbStructuredData
        items={[
          { name: 'Ana Sayfa', url: 'https://prompts34.com' },
          { name: 'Araçlar', url: CANONICAL_URL },
        ]}
      />
      <CollectionPageStructuredData
        name="Yapay Zeka Araçları için Türkçe Promptlar"
        description="ChatGPT, Claude, Gemini ve Copilot için hazır Türkçe promptlar."
        url={CANONICAL_URL}
      />
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Yapay Zeka Araçları
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Hangi yapay zeka aracını kullandığınızı seçin ve o araç için özenle
            hazırlanmış Türkçe promptları keşfedin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOOL_HUBS.map((hub) => (
            <Link
              key={hub.slug}
              href={hub.canonicalPath}
              className={`block rounded-lg border bg-white p-6 transition-colors dark:bg-zinc-950 ${accentBorderMap[hub.accentColor]}`}
            >
              <h2
                className={`text-xl font-semibold mb-2 ${accentTextMap[hub.accentColor]}`}
              >
                {hub.title}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {hub.description}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
