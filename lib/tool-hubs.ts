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
  accentColor: 'blue' | 'purple' | 'orange' | 'green';
}

export const CHATGPT_HUB: ToolHubDefinition = {
  slug: 'chatgpt-promptlari',
  title: 'ChatGPT Promptları',
  description:
    'ChatGPT için hazırlanmış Türkçe yapay zeka promptları. GPT-4, GPT-4o ve diğer ChatGPT modelleriyle metin, kod, analiz ve içerik üretin.',
  canonicalPath: '/araclar/chatgpt-promptlari',
  introHeading: 'ChatGPT Promptları',
  introBody:
    "ChatGPT ve OpenAI modelleri için özenle seçilmiş Türkçe promptlar. İçerik üretimi, analiz, kodlama ve günlük iş akışlarınızda ChatGPT'den maksimum verim almak için hazırlanmış komut örneklerini keşfedin.",
  tipsHeading: 'ChatGPT İpuçları',
  tips: [
    "Rolü ve hedefi prompt'un ilk satırında net olarak belirtin",
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
  canonicalPath: '/araclar/gemini-promptlari',
  introHeading: 'Gemini Promptları',
  introBody:
    "Google Gemini modelleri için seçilmiş Türkçe promptlar. Araştırma, özetleme, kodlama ve çok modlu görevlerde Gemini'nin güçlü yönlerini kullanmanızı sağlayacak komut örneklerini keşfedin.",
  tipsHeading: 'Gemini İpuçları',
  tips: [
    'Görevi ve beklenen çıktıyı açık cümlelerle tanımlayın',
    'Çok modlu görevlerde metin ve görsel bağlamı birlikte verin',
    'Uzun kaynakları özetlerken anahtar sorularınızı listeleyin',
    "Gemini'den kaynak ve gerekçe istemekten çekinmeyin",
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

export const CLAUDE_HUB: ToolHubDefinition = {
  slug: 'claude-promptlari',
  title: 'Claude Promptları',
  description:
    'Anthropic Claude için hazırlanmış Türkçe yapay zeka promptları. Claude 3, Claude 4 ve Sonnet modelleriyle analiz, yazma ve kodlama görevlerinde verim alın.',
  canonicalPath: '/araclar/claude-promptlari',
  introHeading: 'Claude Promptları',
  introBody:
    "Anthropic Claude modelleri için özenle seçilmiş Türkçe promptlar. Uzun metin analizi, detaylı yazma ve kodlama görevlerinde Claude'un güçlü yönlerini kullanmak için hazırlanmış komut örneklerini keşfedin.",
  tipsHeading: 'Claude İpuçları',
  tips: [
    "Uzun ve karmaşık görevler için Claude'a detaylı bağlam verin",
    'Analiz isteklerinde kaynak veya gerekçe isteyin',
    'Büyük belgeleri doğrudan yapıştırarak özetleyin veya sorgulayın',
    'Çok adımlı görevleri sıralı talimatlarla tarif edin',
  ],
  emptyMessage: 'Henüz Claude ile ilgili prompt bulunmuyor.',
  breadcrumbName: 'Claude Promptları',
  keywords: [
    'claude promptları',
    'anthropic claude türkçe',
    'claude ai prompt',
    'claude yapay zeka',
    'yapay zeka promptları',
  ],
  modelKeywords: [
    'claude',
    'anthropic',
    'claude-3',
    'claude-4',
    'claude sonnet',
    'claude opus',
    'claude haiku',
  ],
  tagKeywords: ['claude', 'anthropic'],
  accentColor: 'orange',
};

export const COPILOT_HUB: ToolHubDefinition = {
  slug: 'copilot-promptlari',
  title: 'Copilot Promptları',
  description:
    "Microsoft Copilot ve GitHub Copilot için hazırlanmış Türkçe yapay zeka promptları. Office 365, Teams ve geliştirici araçlarında Copilot'tan daha fazla verim alın.",
  canonicalPath: '/araclar/copilot-promptlari',
  introHeading: 'Copilot Promptları',
  introBody:
    "Microsoft Copilot ve GitHub Copilot için seçilmiş Türkçe promptlar. Word, Excel, Teams ve kod editörlerinde Copilot'u daha verimli kullanmak için hazırlanmış komut örneklerini keşfedin.",
  tipsHeading: 'Copilot İpuçları',
  tips: [
    'Office belgelerinizde bağlamı önceden paylaşın',
    "Copilot'tan belirli bir format veya tablo istemekten çekinmeyin",
    'GitHub Copilot için kod amacını yorum satırıyla açıklayın',
    'Toplantı özetleri için anahtar kararları vurgulamasını isteyin',
  ],
  emptyMessage: 'Henüz Copilot ile ilgili prompt bulunmuyor.',
  breadcrumbName: 'Copilot Promptları',
  keywords: [
    'copilot promptları',
    'microsoft copilot türkçe',
    'github copilot prompt',
    'office copilot',
    'yapay zeka promptları',
  ],
  modelKeywords: [
    'copilot',
    'microsoft copilot',
    'github copilot',
    'bing chat',
    'bing copilot',
  ],
  tagKeywords: ['copilot', 'microsoft', 'github copilot'],
  accentColor: 'green',
};

export const TOOL_HUBS: ToolHubDefinition[] = [
  CHATGPT_HUB,
  GEMINI_HUB,
  CLAUDE_HUB,
  COPILOT_HUB,
];

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
