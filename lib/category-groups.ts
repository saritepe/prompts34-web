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
    title: 'Coding',
    description: 'Programming and development prompts.',
    topicSlugs: ['yazilim-gelistirme'],
  },
  {
    slug: 'writing',
    icon: '✍️',
    title: 'Writing',
    description: 'Content writing and copywriting.',
    topicSlugs: ['pazarlama-ve-icerik', 'sosyal-medya'],
  },
  {
    slug: 'business',
    icon: '💼',
    title: 'Business',
    description:
      'Business strategy, communication, recruiting, and operations prompts.',
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
    title: 'Creative',
    description: 'Art, design, visual generation, and creative work.',
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
    title: 'Education',
    description: 'Learning, teaching, tutoring, and educational prompts.',
    topicSlugs: ['egitim'],
  },
  {
    slug: 'workflows',
    icon: '⚡',
    title: 'Workflows',
    description:
      'Structured AI workflows, automations, and multi-step pipelines.',
    topicSlugs: ['uretkenlik'],
  },
  {
    slug: 'productivity',
    icon: '⏲️',
    title: 'Productivity',
    description:
      'Efficiency, communication, and research prompts for getting more done.',
    topicSlugs: ['e-posta'],
  },
  {
    slug: 'self-improvement',
    icon: '🌱',
    title: 'Self Improvement',
    description:
      'Personal growth, career development, mindset, and skill-building prompts.',
    topicSlugs: ['kariyer-gelisim'],
  },
  {
    slug: 'business-strategy',
    icon: '💼',
    title: 'Business Strategy',
    description:
      'Strategic thinking, planning, startup, and business growth prompts.',
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
