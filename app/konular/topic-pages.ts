import { PromptResponse } from '@/types/prompt';

export interface TopicDefinition {
  slug: string;
  title: string;
  description: string;
  introHeading: string;
  introBody: string;
  canonicalPath: string;
  matchTags: string[];
  excludedPromptIds?: string[];
}

export const TOPIC_PAGES: TopicDefinition[] = [
  {
    slug: 'pazarlama-ve-icerik',
    title: 'Pazarlama ve İçerik Üretimi Promptları',
    description:
      'Dijital pazarlama, sosyal medya içerik üretimi, SEO ve e-posta kampanyaları için yapay zeka promptları.',
    introHeading: 'Pazarlama ve İçerik Üretimi Promptları',
    introBody:
      'Dijital pazarlama stratejilerinizi güçlendirin. Blog yazıları, sosyal medya içerikleri, e-posta kampanyaları ve SEO uyumlu içerikler oluşturmak için hazırlanmış AI promptları ile içerik üretim sürecinizi hızlandırın.',
    canonicalPath: '/konular/pazarlama-ve-icerik',
    matchTags: [
      'pazarlama',
      'sosyal medya',
      'içerik üretimi',
      'seo',
      'blog',
      'viral post',
      'e-posta',
      'satış',
      'dönüşüm',
      'thread yazma',
      'etkileşim artır',
    ],
  },
  {
    slug: 'sanat-ve-yaraticilik',
    title: 'Sanat ve Yaratıcılık Promptları',
    description:
      'Sanatsal görseller, illüstrasyonlar, film yapımı ve yaratıcı projeler için yapay zeka promptları.',
    introHeading: 'Sanat ve Yaratıcılık Promptları',
    introBody:
      'Yaratıcı projelerinize ilham katın. Sürreal sanat eserlerinden illüstrasyonlara, film yapımından yaratıcı yazarlığa kadar geniş bir yelpazede AI destekli sanat promptları keşfedin.',
    canonicalPath: '/konular/sanat-ve-yaraticilik',
    matchTags: [
      'sanat',
      'sürreal',
      'illüstrasyon',
      'Yaratıcı Yazarlık',
      'Görsel Sanatlar',
      'stilize',
      'Film Yapımı',
      'Hikaye Anlatıcılığı',
      'Sinema',
    ],
  },
  {
    slug: 'portre-ve-fotograf',
    title: 'Portre ve Fotoğraf Promptları',
    description:
      'Fotogerçekçi portreler, profesyonel fotoğraflar ve sosyal medya görselleri için yapay zeka promptları.',
    introHeading: 'Portre ve Fotoğraf Promptları',
    introBody:
      'Profesyonel kalitede portreler ve fotoğraflar oluşturun. Kurumsal fotoğraflardan sosyal medya selfielerine, stüdyo çekimlerinden doğal ışık portrelerine kadar çeşitli fotoğraf stilleri için AI promptları.',
    canonicalPath: '/konular/portre-ve-fotograf',
    matchTags: [
      'portre',
      'selfie',
      'fotogerçekçi',
      'stüdyo',
      'stüdyo çekimi',
      'profesyonel',
      'kurumsal',
      'doğal ışık',
      'influencer',
    ],
  },
  {
    slug: 'is-stratejisi',
    title: 'İş Stratejisi ve Planlama Promptları',
    description:
      'İş planı, startup stratejisi, proje yönetimi ve sunum hazırlığı için yapay zeka promptları.',
    introHeading: 'İş Stratejisi ve Planlama Promptları',
    introBody:
      'İş süreçlerinizi yapay zeka ile optimize edin. İş planı oluşturma, strateji geliştirme, sunum hazırlama ve proje yönetimi için hazırlanmış promptlarla iş dünyasında bir adım öne geçin.',
    canonicalPath: '/konular/is-stratejisi',
    matchTags: [
      'iş planı',
      'startup',
      'strateji',
      'kpi',
      'sunum',
      'iletişim',
      'Proje Yönetimi',
      'İş Akışları',
      'Otomasyon',
    ],
  },
  {
    slug: 'yazilim-gelistirme',
    title: 'Yazılım Geliştirme Promptları',
    description:
      'Kod inceleme, hata ayıklama, yazılım mühendisliği ve DevOps için yapay zeka promptları.',
    introHeading: 'Yazılım Geliştirme Promptları',
    introBody:
      'Yazılım geliştirme sürecinizi hızlandırın. Kod inceleme, hata ayıklama, refactoring ve DevOps süreçleri için hazırlanmış AI promptları ile daha verimli ve kaliteli kod yazın.',
    canonicalPath: '/konular/yazilim-gelistirme',
    matchTags: [
      'yazılım',
      'kodlama',
      'programlama',
      'kod inceleme',
      'refactor',
      'geliştirici',
      'Kod İnceleme',
      'Hata Ayıklama',
      'DevOps',
      'Test',
      'sistem prompt',
    ],
  },
  {
    slug: 'midjourney-gorsel',
    title: 'Midjourney Görsel Üretim Promptları',
    description:
      'Midjourney ve Flux ile profesyonel görseller oluşturmak için optimize edilmiş yapay zeka promptları.',
    introHeading: 'Midjourney Görsel Üretim Promptları',
    introBody:
      'Midjourney ve Flux gibi görsel üretim araçları için özel olarak hazırlanmış promptlar. Portrelerden mimari görsellere, sanat eserlerinden ürün fotoğraflarına kadar geniş bir yelpazede profesyonel görseller oluşturun.',
    canonicalPath: '/konular/midjourney-gorsel',
    matchTags: ['midjourney', 'flux'],
  },
  {
    slug: 'kariyer-gelisim',
    title: 'Kariyer Gelişimi Promptları',
    description:
      'Kariyer planlama, iş başvurusu, LinkedIn optimizasyonu ve kişisel marka geliştirme için yapay zeka promptları.',
    introHeading: 'Kariyer Gelişimi Promptları',
    introBody:
      'Kariyerinizi yapay zeka ile şekillendirin. CV hazırlama, mülakat hazırlığı, LinkedIn profil güçlendirme, cover letter yazımı ve kişisel marka oluşturma için kapsamlı prompt koleksiyonu.',
    canonicalPath: '/konular/kariyer-gelisim',
    matchTags: [
      'kariyer',
      'iş başvurusu',
      'linkedin',
      'kişisel marka',
      'cover letter',
      'ön yazı',
    ],
  },
];

export function getTopicBySlug(slug: string): TopicDefinition | undefined {
  return TOPIC_PAGES.find((topic) => topic.slug === slug);
}

export function getAllTopicSlugs(): string[] {
  return TOPIC_PAGES.map((topic) => topic.slug);
}

export function matchPromptsForTopic(
  prompts: PromptResponse[],
  topic: TopicDefinition,
): PromptResponse[] {
  const matchTagsLower = new Set(topic.matchTags.map((t) => t.toLowerCase()));
  const excludedIds = new Set(topic.excludedPromptIds ?? []);

  return prompts
    .filter((prompt) => {
      if (excludedIds.has(prompt.id)) return false;
      return prompt.tags.some((tag) => matchTagsLower.has(tag.toLowerCase()));
    })
    .sort((a, b) => {
      const likeDiff = b.like_count - a.like_count;
      if (likeDiff !== 0) return likeDiff;
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
}
