import HomePageClient from '@/components/HomePageClient';
import { getPublicPrompts } from '@/lib/api/prompts';
import type { PromptResponse } from '@/types/prompt';

export const revalidate = 300;

export default async function Home() {
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
      initialLoadError={initialLoadError}
    />
  );
}
