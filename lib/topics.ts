import type { PromptResponse } from '@/types/prompt';

export interface TopicDefinition {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  tags: string[];
  legacyPaths?: string[];
  excludedPromptIds?: string[];
}

export const TOPICS: TopicDefinition[] = [
  {
    slug: 'cv-hazirlama',
    title: 'CV Hazırlama',
    description:
      'CV hazırlama promptları, deneyimlerinizi ATS uyumlu ve işe alım uzmanları için okunabilir bir yapıya dönüştürmenize yardımcı olur. Bu konu altında özgeçmiş, başarı maddeleri, profesyonel özet ve pozisyona göre anahtar kelime optimizasyonu için kullanılabilecek Türkçe yapay zeka promptlarını bulabilirsiniz.',
    keywords: ['cv', 'özgeçmiş', 'ozgecmis', 'resume', 'ats'],
    tags: ['cv', 'özgeçmiş', 'kariyer', 'iş başvurusu'],
    legacyPaths: ['/cv-hazirlama'],
  },
  {
    slug: 'motivasyon-mektubu',
    title: 'Motivasyon Mektubu',
    description:
      'Motivasyon mektubu promptları, iş, staj, burs, Erasmus ve yüksek lisans başvuruları için net ve ikna edici metinler hazırlamayı kolaylaştırır. Bu sayfada başvuru amacınızı, geçmiş deneyimlerinizi ve hedeflerinizi tutarlı bir hikaye içinde anlatmanıza yardımcı olacak promptlar yer alır.',
    keywords: [
      'motivasyon',
      'motivasyon mektubu',
      'motivational letter',
      'cover letter',
      'ön yazı',
      'on yazi',
    ],
    tags: ['motivasyon-mektubu', 'motivational-letter', 'kariyer'],
    legacyPaths: ['/motivasyon-mektubu'],
  },
  {
    slug: 'mulakat-hazirligi',
    title: 'Mülakat Hazırlığı',
    description:
      'Mülakat hazırlığı promptları, hedef pozisyonunuza göre olası soruları, güçlü cevap taslaklarını ve STAR tekniğine uygun örnekleri çalışmanıza yardımcı olur. Yeni mezun, junior, mid veya senior seviyede olsanız da bu konu sayfası iş görüşmesine daha planlı hazırlanmanız için pratik promptlar sunar.',
    keywords: [
      'mülakat',
      'mulakat',
      'interview',
      'iş görüşmesi',
      'is gorusmesi',
    ],
    tags: ['mülakat', 'mulakat', 'interview', 'kariyer', 'star'],
    legacyPaths: ['/mulakat-hazirligi'],
  },
  {
    slug: 'gorsel-olusturma',
    title: 'Görsel Oluşturma',
    description:
      'Görsel oluşturma promptları, yapay zeka araçlarıyla portre, sosyal medya görseli, ürün fotoğrafı ve yaratıcı sahne tasarımları üretmek isteyenler için hazırlanır. Bu konu altında görsel stil, ışık, kamera, kompozisyon ve çıktı oranı gibi detayları netleştiren Türkçe prompt örnekleri bulunur.',
    keywords: ['görsel', 'gorsel', 'image', 'image generation', 'resim'],
    tags: ['görsel', 'görsel üretim', 'image-generation', 'midjourney', 'flux'],
    legacyPaths: ['/gorsel-olusturma'],
  },
  {
    slug: 'logo-olusturma',
    title: 'Logo Oluşturma',
    description:
      'Logo oluşturma promptları, marka kimliği, sektör, renk paleti ve görsel stil beklentilerini yapay zeka araçlarına daha doğru aktarmanıza yardımcı olur. Minimal, modern, premium veya eğlenceli logo fikirleri üretirken daha tutarlı sonuçlar almak için bu sayfadaki promptları kullanabilirsiniz.',
    keywords: ['logo', 'logo oluşturma', 'logo olusturma', 'marka', 'brand'],
    tags: ['logo', 'logo oluşturma', 'marka', 'görsel üretim', 'midjourney'],
    legacyPaths: ['/logo-olusturma'],
  },
  {
    slug: 'oyun',
    title: 'Oyun Promptları',
    description:
      'Oyun promptları, karakter tasarımı, hikaye kurgusu, görev sistemi, seviye fikri ve oyun mekaniği üretmek isteyen kullanıcılar için bir başlangıç noktası sunar. Bu konu sayfası oyun geliştirme, rol yapma senaryoları ve yaratıcı dünya kurma çalışmalarında kullanılabilecek promptları bir araya getirir.',
    keywords: ['oyun', 'game', 'gaming', 'rpg', 'karakter'],
    tags: ['oyun', 'game', 'gaming', 'rpg', 'karakter', 'hikaye anlatıcılığı'],
  },
  {
    slug: 'pazarlama-ve-icerik',
    title: 'Pazarlama ve İçerik Üretimi',
    description:
      'Pazarlama ve içerik üretimi promptları, blog yazısı, sosyal medya paylaşımı, SEO metni, e-posta kampanyası ve satış odaklı içerik hazırlama süreçlerini hızlandırır. Bu konu, hedef kitleye göre daha net brief vermek ve tekrar kullanılabilir içerik akışları oluşturmak isteyen ekipler için uygundur.',
    keywords: ['pazarlama', 'marketing', 'içerik', 'icerik', 'seo', 'blog'],
    tags: [
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
    title: 'Sanat ve Yaratıcılık',
    description:
      'Sanat ve yaratıcılık promptları, görsel sanatlar, illüstrasyon, sinema, hikaye anlatıcılığı ve deneysel üretim fikirleri için tasarlanır. Bu sayfa yaratıcı projelerde atmosfer, stil, kompozisyon ve anlatı tonunu daha iyi tarif etmek isteyen kullanıcılar için seçilmiş promptlar sunar.',
    keywords: ['sanat', 'yaratıcılık', 'yaraticilik', 'art', 'sinema'],
    tags: [
      'sanat',
      'sürreal',
      'illüstrasyon',
      'yaratıcı yazarlık',
      'görsel sanatlar',
      'stilize',
      'film yapımı',
      'hikaye anlatıcılığı',
      'sinema',
    ],
  },
  {
    slug: 'portre-ve-fotograf',
    title: 'Portre ve Fotoğraf',
    description:
      'Portre ve fotoğraf promptları, sosyal medya portreleri, profesyonel profil fotoğrafları, stüdyo çekimleri ve doğal ışık kompozisyonları için kullanılabilir. Bu konu sayfası kamera açısı, lens, ışık ve gerçekçilik detaylarını daha kontrollü tarif etmenize yardımcı olur.',
    keywords: ['portre', 'fotoğraf', 'fotograf', 'selfie', 'portrait'],
    tags: [
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
    title: 'İş Stratejisi ve Planlama',
    description:
      'İş stratejisi ve planlama promptları, girişim fikri, iş modeli, sunum akışı, proje planı ve KPI çalışmaları için yapılandırılmış çıktılar üretmeye yardımcı olur. Bu konu, fikirleri daha uygulanabilir aksiyon planlarına dönüştürmek isteyen ekipler ve kurucular için hazırlanmıştır.',
    keywords: ['iş', 'is', 'startup', 'strateji', 'sunum', 'kpi'],
    tags: [
      'iş planı',
      'startup',
      'strateji',
      'kpi',
      'sunum',
      'iletişim',
      'proje yönetimi',
      'iş akışları',
      'otomasyon',
    ],
  },
  {
    slug: 'yazilim-gelistirme',
    title: 'Yazılım Geliştirme',
    description:
      'Yazılım geliştirme promptları, kod inceleme, hata ayıklama, refactoring, test yazımı ve sistem tasarımı gibi teknik işlerde daha net yapay zeka çıktıları almanıza yardımcı olur. Bu sayfa geliştiriciler için pratik, ölçülebilir ve kontrol edilebilir teknik prompt örnekleri içerir.',
    keywords: ['yazılım', 'yazilim', 'kod', 'programlama', 'devops'],
    tags: [
      'yazılım',
      'kodlama',
      'programlama',
      'kod inceleme',
      'refactor',
      'geliştirici',
      'hata ayıklama',
      'devops',
      'test',
      'sistem prompt',
    ],
  },
  {
    slug: 'midjourney-gorsel',
    title: 'Midjourney Görsel Üretim',
    description:
      'Midjourney görsel üretim promptları, sahne, stil, ışık, kamera ve oran detaylarını netleştirerek daha tutarlı görseller üretmeye odaklanır. Bu konu sayfası Midjourney, Flux ve benzeri görsel üretim araçlarında kullanılabilecek optimize edilmiş prompt örneklerini toplar.',
    keywords: ['midjourney', 'flux', 'ai görsel', 'ai gorsel'],
    tags: ['midjourney', 'flux'],
  },
  {
    slug: 'kariyer-gelisim',
    title: 'Kariyer Gelişimi',
    description:
      'Kariyer gelişimi promptları, iş başvurusu, LinkedIn profili, kişisel marka, mülakat hazırlığı ve kariyer planlama süreçlerini destekler. Bu konu sayfası profesyonel hedeflerinizi daha net ifade etmeniz ve başvuru materyallerinizi güçlendirmeniz için hazırlanmıştır.',
    keywords: [
      'kariyer',
      'linkedin',
      'iş başvurusu',
      'is basvurusu',
      'network',
    ],
    tags: [
      'kariyer',
      'iş başvurusu',
      'linkedin',
      'kişisel marka',
      'cover letter',
      'ön yazı',
    ],
  },
];

export const TOPIC_PAGES = TOPICS;

const TURKISH_CHAR_MAP: Record<string, string> = {
  ç: 'c',
  ğ: 'g',
  ı: 'i',
  ö: 'o',
  ş: 's',
  ü: 'u',
};

export function normalizeQuery(query: string): string {
  return query
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replace(
      /[çğıöşü]/g,
      (character) => TURKISH_CHAR_MAP[character] ?? character,
    )
    .replace(/\s+/g, ' ');
}

export function getTopicPath(topic: TopicDefinition): string {
  return `/konular/${topic.slug}`;
}

export function getTopicBySlug(slug: string): TopicDefinition | undefined {
  return TOPICS.find((topic) => topic.slug === slug);
}

export function getAllTopicSlugs(): string[] {
  return TOPICS.map((topic) => topic.slug);
}

export function findTopicByKeyword(query: string): TopicDefinition | undefined {
  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery) {
    return undefined;
  }

  return TOPICS.find((topic) =>
    topic.keywords.some(
      (keyword) => normalizeQuery(keyword) === normalizedQuery,
    ),
  );
}

export function matchPromptsForTopic(
  prompts: PromptResponse[],
  topic: TopicDefinition,
): PromptResponse[] {
  const normalizedTags = new Set(topic.tags.map((tag) => normalizeQuery(tag)));
  const excludedIds = new Set(topic.excludedPromptIds ?? []);

  return prompts
    .filter((prompt) => {
      if (excludedIds.has(prompt.id)) return false;
      return prompt.tags.some((tag) => normalizedTags.has(normalizeQuery(tag)));
    })
    .sort((a, b) => {
      const likeDiff = b.like_count - a.like_count;
      if (likeDiff !== 0) return likeDiff;
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
}
