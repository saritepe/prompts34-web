export {
  TOPICS as TOPIC_PAGES,
  findTopicByKeyword,
  getAllTopicSlugs,
  getTopicBySlug,
  getTopicPath,
  matchPromptsForTopic,
  normalizeQuery,
} from '@/lib/topics';
export type { TopicDefinition } from '@/lib/topics';
