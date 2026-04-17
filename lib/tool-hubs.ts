import { PromptResponse } from '@/types/prompt';

export interface ToolHubTip {
  text: string;
}

export interface ToolHubDefinition {
  slug: string;
  title: string;
  description: string;
  canonicalPath: string;
  introHeading: string;
  introBody: string;
  tipsHeading: string;
  tips: string[];
  emptyMessage: string;
  breadcrumbName: string;
  keywords: string[];
  modelKeywords: string[];
  tagKeywords: string[];
  accentColor: 'blue' | 'purple';
}

export const CHATGPT_HUB: ToolHubDefinition = {
  slug: 'chatgpt-promptlari',
  title: 'ChatGPT Promptları',
  description:
    'ChatGPT için hazırlanmış Türkçe yapay zeka promptları. GPT-4, GPT-4o ve diğer ChatGPT modelleriyle metin, kod, analiz ve içerik üretin.',
  canonicalPath: '/chatgpt-promptlari',
  introHeading: 'ChatGPT Promptları',
  introBody:
    'ChatGPT ve OpenAI modelleri için özenle seçilmiş Türkçe promptlar. İçerik üretimi, analiz, kodlama ve günlük iş akışlarınızda ChatGPT’den maksimum verim almak için hazırlanmış komut örneklerini keşfedin.',
  tipsHeading: 'ChatGPT İpuçları',
  tips: [
    'Rolü ve hedefi prompt’un ilk satırında net olarak belirtin',
    'Beklediğiniz format ve uzunluğu açıkça yazın',
    'Gerekli bağlamı ve örnekleri prompt içinde verin',
    'Uzun görevleri adım adım bölüp sıralı talimatlar kullanın',
  ],
  emptyMessage: 'Henüz ChatGPT ile ilgili prompt bulunmuyor.',
  breadcrumbName: 'ChatGPT Promptları',
  keywords: [
    'chatgpt',
    'chatgpt promptları',
    'gpt-4 promptları',
    'gpt-4o',
    'openai promptları',
    'türkçe chatgpt',
    'yapay zeka promptları',
  ],
  modelKeywords: [
    'chatgpt',
    'gpt-3',
    'gpt-3.5',
    'gpt-4',
    'gpt-4o',
    'gpt-4.5',
    'gpt-5',
    'openai o1',
    'openai o3',
    'openai o4',
  ],
  tagKeywords: ['chatgpt', 'gpt', 'gpt-4', 'gpt-4o', 'openai'],
  accentColor: 'blue',
};

export const GEMINI_HUB: ToolHubDefinition = {
  slug: 'gemini-promptlari',
  title: 'Gemini Promptları',
  description:
    'Google Gemini için hazırlanmış Türkçe yapay zeka promptları. Gemini Pro ve Flash modelleriyle metin, görsel ve çok modlu görevlerde verim alın.',
  canonicalPath: '/gemini-promptlari',
  introHeading: 'Gemini Promptları',
  introBody:
    'Google Gemini modelleri için seçilmiş Türkçe promptlar. Araştırma, özetleme, kodlama ve çok modlu görevlerde Gemini’nin güçlü yönlerini kullanmanızı sağlayacak komut örneklerini keşfedin.',
  tipsHeading: 'Gemini İpuçları',
  tips: [
    'Görevi ve beklenen çıktıyı açık cümlelerle tanımlayın',
    'Çok modlu görevlerde metin ve görsel bağlamı birlikte verin',
    'Uzun kaynakları özetlerken anahtar sorularınızı listeleyin',
    'Gemini’den kaynak ve gerekçe istemekten çekinmeyin',
  ],
  emptyMessage: 'Henüz Gemini ile ilgili prompt bulunmuyor.',
  breadcrumbName: 'Gemini Promptları',
  keywords: [
    'gemini',
    'gemini promptları',
    'google gemini',
    'gemini pro',
    'gemini flash',
    'türkçe gemini',
    'yapay zeka promptları',
  ],
  modelKeywords: ['gemini', 'bard', 'google gemini'],
  tagKeywords: ['gemini', 'bard', 'google ai', 'google gemini'],
  accentColor: 'purple',
};

export const TOOL_HUBS: ToolHubDefinition[] = [CHATGPT_HUB, GEMINI_HUB];

export function matchPromptsForToolHub(
  prompts: PromptResponse[],
  hub: ToolHubDefinition,
): PromptResponse[] {
  const modelKeywordsLower = hub.modelKeywords.map((k) => k.toLowerCase());
  const tagKeywordsLower = new Set(hub.tagKeywords.map((k) => k.toLowerCase()));

  return prompts
    .filter((prompt) => {
      const model = (prompt.suggested_model ?? '').toLowerCase();
      if (
        model &&
        modelKeywordsLower.some((keyword) => model.includes(keyword))
      ) {
        return true;
      }
      return prompt.tags.some((tag) => tagKeywordsLower.has(tag.toLowerCase()));
    })
    .sort((a, b) => {
      const likeDiff = b.like_count - a.like_count;
      if (likeDiff !== 0) return likeDiff;
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
}
