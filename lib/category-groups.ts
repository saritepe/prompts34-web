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
    slug: 'coding',
    icon: '💻',
    title: 'Kodlama',
    description: 'Programlama ve yazılım geliştirme promptları.',
    topicSlugs: ['yazilim-gelistirme'],
  },
  {
    slug: 'writing',
    icon: '✍️',
    title: 'Yazma',
    description: 'İçerik yazımı ve metin üretimi promptları.',
    topicSlugs: ['pazarlama-ve-icerik', 'sosyal-medya'],
  },
  {
    slug: 'business',
    icon: '💼',
    title: 'İş Dünyası',
    description: 'İş stratejisi, iletişim, işe alım ve operasyon promptları.',
    topicSlugs: [
      'cv-hazirlama',
      'motivasyon-mektubu',
      'mulakat-hazirligi',
      'e-ticaret',
    ],
  },
  {
    slug: 'creative',
    icon: '🎨',
    title: 'Yaratıcı',
    description: 'Sanat, tasarım, görsel üretim ve yaratıcı işler.',
    topicSlugs: [
      'gorsel-olusturma',
      'logo-olusturma',
      'portre-ve-fotograf',
      'midjourney-gorsel',
      'oyun',
      'sanat-ve-yaraticilik',
    ],
  },
  {
    slug: 'education',
    icon: '📚',
    title: 'Eğitim',
    description: 'Öğrenme, öğretim, ders çalışma ve eğitim promptları.',
    topicSlugs: ['egitim'],
  },
  {
    slug: 'workflows',
    icon: '⚡',
    title: 'İş Akışları',
    description:
      'Yapılandırılmış yapay zeka iş akışları, otomasyonlar ve çok adımlı süreçler.',
    topicSlugs: ['uretkenlik'],
  },
  {
    slug: 'productivity',
    icon: '⏲️',
    title: 'Üretkenlik',
    description:
      'Daha verimli çalışmak için iletişim, araştırma ve günlük verimlilik promptları.',
    topicSlugs: ['e-posta'],
  },
  {
    slug: 'self-improvement',
    icon: '🌱',
    title: 'Kişisel Gelişim',
    description:
      'Kişisel gelişim, kariyer ilerlemesi, motivasyon ve beceri geliştirme promptları.',
    topicSlugs: ['kariyer-gelisim'],
  },
  {
    slug: 'business-strategy',
    icon: '💼',
    title: 'İş Stratejisi',
    description:
      'Stratejik düşünme, planlama, girişim ve iş büyütme promptları.',
    topicSlugs: ['is-stratejisi'],
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
