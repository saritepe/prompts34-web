import HomePageClient from '@/components/HomePageClient';
import { getPublicPrompts } from '@/lib/api/prompts';
import type { PromptResponse } from '@/types/prompt';

export const dynamic = 'force-dynamic';

type HomePageSearchParams = Record<string, string | string[] | undefined>;

type HomePageProps = {
  searchParams?: Promise<HomePageSearchParams> | HomePageSearchParams;
};

function getInitialSearch(searchParams: HomePageSearchParams): string {
  const queryValue = searchParams.q;

  if (typeof queryValue === 'string') {
    return queryValue;
  }

  if (Array.isArray(queryValue)) {
    return queryValue[0] ?? '';
  }

  return '';
}

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  let initialPrompts: PromptResponse[] = [];
  let initialLoadError: string | null = null;

  try {
    initialPrompts = await getPublicPrompts();
  } catch (error) {
    initialLoadError = 'Promptlar yüklenirken bir hata oluştu';
    console.error('Failed to fetch homepage prompts.', error);
  }

  return (
    <HomePageClient
      initialPrompts={initialPrompts}
      initialSearch={getInitialSearch(resolvedSearchParams)}
      initialLoadError={initialLoadError}
    />
  );
}
