import {
  matchPromptsForTopic,
  TOPICS,
  type TopicDefinition,
} from '@/lib/topics';
import type { PromptResponse } from '@/types/prompt';

export interface CategoryGroupDefinition {
  slug: string;
  icon: string;
  title: string;
  description: string;
  topicSlugs: string[];
}

export interface CategoryGroupSummary extends CategoryGroupDefinition {
  topics: TopicDefinition[];
  promptCount: number;
}

export const CATEGORY_GROUPS: CategoryGroupDefinition[] = [
  {
    slug: 'career',
    icon: '💼',
    title: 'Kariyer',
    description:
      'CV, mülakat, LinkedIn ve profesyonel gelişim odaklı promptlar.',
    topicSlugs: [
      'cv-hazirlama',
      'motivasyon-mektubu',
      'mulakat-hazirligi',
      'kariyer-gelisim',
    ],
  },
  {
    slug: 'coding',
    icon: '💻',
    title: 'Yazılım',
    description:
      'Kodlama, hata ayıklama, refactoring ve teknik iş akışları için promptlar.',
    topicSlugs: ['yazilim-gelistirme'],
  },
  {
    slug: 'marketing-content',
    icon: '📣',
    title: 'Pazarlama ve İçerik',
    description:
      'Sosyal medya, blog, SEO ve kampanya üretimi için içerik promptları.',
    topicSlugs: ['pazarlama-ve-icerik', 'sosyal-medya'],
  },
  {
    slug: 'business-email',
    icon: '✉️',
    title: 'İş ve E-posta',
    description:
      'İş iletişimi, strateji, satış ve e-posta süreçlerini destekleyen promptlar.',
    topicSlugs: ['is-stratejisi', 'e-posta', 'e-ticaret'],
  },
  {
    slug: 'design-visuals',
    icon: '🎨',
    title: 'Tasarım ve Görsel',
    description:
      'Görsel üretim, logo, portre ve stil odaklı yaratıcı promptlar.',
    topicSlugs: [
      'gorsel-olusturma',
      'logo-olusturma',
      'portre-ve-fotograf',
      'midjourney-gorsel',
    ],
  },
  {
    slug: 'education-learning',
    icon: '📚',
    title: 'Eğitim ve Öğrenme',
    description:
      'Ders planı, özetleme, öğretim ve öğrenme süreçleri için promptlar.',
    topicSlugs: ['egitim'],
  },
  {
    slug: 'productivity',
    icon: '⚡',
    title: 'Üretkenlik',
    description:
      'Planlama, görev yönetimi ve günlük iş akışlarını hızlandıran promptlar.',
    topicSlugs: ['uretkenlik'],
  },
  {
    slug: 'creative-fun',
    icon: '🎮',
    title: 'Yaratıcılık ve Eğlence',
    description:
      'Oyun, hikâye, deneysel üretim ve yaratıcı fikir geliştirme promptları.',
    topicSlugs: ['oyun', 'sanat-ve-yaraticilik'],
  },
];

export function getTopicsForCategoryGroup(
  group: CategoryGroupDefinition,
): TopicDefinition[] {
  return group.topicSlugs
    .map((slug) => TOPICS.find((topic) => topic.slug === slug))
    .filter((topic): topic is TopicDefinition => Boolean(topic));
}

export function getCategoryGroupSummaries(
  prompts: PromptResponse[],
): CategoryGroupSummary[] {
  return CATEGORY_GROUPS.map((group) => {
    const topics = getTopicsForCategoryGroup(group);
    const promptIds = new Set<string>();

    for (const topic of topics) {
      for (const prompt of matchPromptsForTopic(prompts, topic)) {
        promptIds.add(prompt.id);
      }
    }

    return {
      ...group,
      topics,
      promptCount: promptIds.size,
    };
  });
}
