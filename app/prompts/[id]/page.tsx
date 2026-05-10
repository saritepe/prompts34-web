import type { Metadata } from 'next';
import { permanentRedirect, notFound } from 'next/navigation';
import { PromptStructuredData } from '@/app/components/StructuredData';
import PromptDetailClient from '@/components/PromptDetailClient';
import {
  sharedOpenGraphImage,
  sharedTwitterImage,
} from '@/app/shared-metadata';
import { getPrompt } from '@/lib/api/prompts';
import { buildDescription } from '@/lib/metadata';
import { getPromptPath } from '@/lib/utils/slug';
import type { PromptResponse } from '@/types/prompt';

export const revalidate = 300;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

function extractUuid(id: string): string {
  return UUID_REGEX.exec(id)?.[0] ?? id;
}

function getPublicDescription(prompt: PromptResponse): string {
  return buildDescription(
    prompt.explanation ||
      `${prompt.title} promptunun detaylarını görmek, kopyalamak ve kullanmak için Prompts34 hesabınızla giriş yapın.`,
  );
}

function redactPromptDetails(prompt: PromptResponse): PromptResponse {
  return {
    ...prompt,
    content: '',
    output: null,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const uuid = extractUuid(id);
  const prompt = await getPrompt(uuid).catch(() => null);

  if (!prompt) {
    return notFound();
  }

  if (id === uuid && UUID_REGEX.test(id)) {
    return { robots: { index: false, follow: false } };
  }

  const canonicalUrl = `https://prompts34.com${getPromptPath(prompt)}`;
  const description = getPublicDescription(prompt);
  const title = prompt.title;
  const fullTitle = `${title} | Prompts34`;

  return {
    title,
    description,
    keywords: prompt.tags?.length ? prompt.tags : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      ...sharedOpenGraphImage,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      ...sharedTwitterImage,
    },
  };
}

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const uuid = extractUuid(id);
  const prompt = await getPrompt(uuid).catch(() => null);

  if (!prompt) {
    return notFound();
  }

  if (id === uuid && UUID_REGEX.test(id)) {
    permanentRedirect(getPromptPath(prompt));
  }

  const description = getPublicDescription(prompt);

  return (
    <>
      <PromptStructuredData
        title={prompt.title}
        description={description}
        url={`https://prompts34.com${getPromptPath(prompt)}`}
        datePublished={prompt.created_at}
      />
      <PromptDetailClient prompt={redactPromptDetails(prompt)} />
    </>
  );
}
