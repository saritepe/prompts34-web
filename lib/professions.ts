import type { PromptResponse } from '@/types/prompt';
import { normalizeQuery } from '@/lib/topics';

export interface ProfessionDefinition {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  tags: string[];
}

export const PROFESSIONS: ProfessionDefinition[] = [
  {
    slug: 'yazilimci',
    title: 'Yazılımcılar İçin Promptlar',
    description:
      'Yazılım geliştiriciler için Türkçe yapay zeka promptları. Kod üretimi, kod review, refactoring, test yazma, regex, SQL ve dökümantasyon için hazır komutlar.',
    keywords: [
      'yazılımcı promptları',
      'developer için chatgpt',
      'kod prompt',
      'yazılım geliştirici prompt',
      'github copilot prompt',
    ],
    tags: ['yazılım', 'kod', 'developer', 'github copilot', 'programlama'],
  },
  {
    slug: 'pazarlamaci',
    title: 'Pazarlamacılar İçin Promptlar',
    description:
      'Pazarlama profesyonelleri için Türkçe yapay zeka promptları. Kampanya konsepti, hedef kitle analizi, copywriting, SEO ve sosyal medya için hazır promptlar.',
    keywords: [
      'pazarlama promptları',
      'marketing prompt',
      'reklam metni prompt',
      'pazarlamacı için chatgpt',
    ],
    tags: ['pazarlama', 'marketing', 'reklam', 'kampanya', 'içerik'],
  },
  {
    slug: 'icerik-uretici',
    title: 'İçerik Üreticileri İçin Promptlar',
    description:
      'Blogger, YouTuber ve sosyal medya içerik üreticileri için Türkçe yapay zeka promptları. Başlık, senaryo, metin yapılandırma ve fikir üretme için hazır komutlar.',
    keywords: [
      'içerik üretici prompt',
      'youtuber prompt',
      'blog yazısı prompt',
      'içerik fikri prompt',
    ],
    tags: ['içerik', 'blog', 'youtube', 'sosyal medya', 'instagram'],
  },
  {
    slug: 'ogretmen',
    title: 'Öğretmenler İçin Promptlar',
    description:
      'Öğretmen ve eğitimciler için Türkçe yapay zeka promptları. Ders planı, çalışma kâğıdı, sınav sorusu, öğrenme aktivitesi ve değerlendirme için hazır komutlar.',
    keywords: [
      'öğretmen promptları',
      'ders planı prompt',
      'eğitim için chatgpt',
      'sınav sorusu prompt',
    ],
    tags: ['eğitim', 'öğretmen', 'ders', 'okul', 'müfredat'],
  },
  {
    slug: 'ogrenci',
    title: 'Öğrenciler İçin Promptlar',
    description:
      'Öğrenciler için Türkçe yapay zeka promptları. Ödev yardımı, özet çıkarma, sınav hazırlığı, çalışma planı ve kaynak araştırması için hazır komutlar.',
    keywords: [
      'öğrenci promptları',
      'ödev prompt',
      'sınav hazırlığı prompt',
      'öğrenci için chatgpt',
    ],
    tags: ['öğrenci', 'ödev', 'sınav', 'çalışma', 'üniversite'],
  },
  {
    slug: 'satisci',
    title: 'Satışçılar İçin Promptlar',
    description:
      'Satış profesyonelleri için Türkçe yapay zeka promptları. Soğuk e-mail, demo senaryosu, itiraz karşılama, takip mesajı ve teklif yazımı için hazır komutlar.',
    keywords: [
      'satış promptları',
      'soğuk email prompt',
      'satışçı için chatgpt',
      'sales prompt',
    ],
    tags: ['satış', 'sales', 'b2b', 'soğuk email', 'crm'],
  },
  {
    slug: 'freelancer',
    title: 'Freelancer İçin Promptlar',
    description:
      'Serbest çalışanlar için Türkçe yapay zeka promptları. Müşteri iletişimi, proje teklifi, fatura, brief netleştirme ve portföy hazırlama için hazır komutlar.',
    keywords: [
      'freelancer prompt',
      'serbest çalışan prompt',
      'proje teklifi prompt',
      'müşteri email prompt',
    ],
    tags: ['freelance', 'serbest', 'müşteri', 'teklif', 'portföy'],
  },
  {
    slug: 'girisimci',
    title: 'Girişimciler İçin Promptlar',
    description:
      'Girişimciler için Türkçe yapay zeka promptları. Pazar araştırması, MVP planı, pitch deck, müşteri görüşmesi ve büyüme stratejisi için hazır komutlar.',
    keywords: [
      'girişimci prompt',
      'startup prompt',
      'pitch deck prompt',
      'iş planı prompt',
    ],
    tags: ['girişim', 'startup', 'iş planı', 'pitch', 'mvp'],
  },
  {
    slug: 'tasarimci',
    title: 'Tasarımcılar İçin Promptlar',
    description:
      'UI/UX, grafik ve ürün tasarımcıları için Türkçe yapay zeka promptları. Wireframe brief, kullanıcı persona, tasarım kritiği ve görsel üretimi için hazır komutlar.',
    keywords: [
      'tasarımcı prompt',
      'ui ux prompt',
      'figma prompt',
      'design prompt türkçe',
    ],
    tags: ['tasarım', 'ui', 'ux', 'figma', 'grafik tasarım'],
  },
  {
    slug: 'ik-uzmani',
    title: 'İK Uzmanları İçin Promptlar',
    description:
      'İnsan kaynakları profesyonelleri için Türkçe yapay zeka promptları. İlan metni, mülakat soruları, performans değerlendirme, geri bildirim ve oryantasyon için hazır komutlar.',
    keywords: [
      'ik prompt',
      'insan kaynakları prompt',
      'mülakat sorusu prompt',
      'iş ilanı prompt',
    ],
    tags: ['ik', 'insan kaynakları', 'mülakat', 'işe alım', 'performans'],
  },
  {
    slug: 'yonetici',
    title: 'Yöneticiler İçin Promptlar',
    description:
      'Yöneticiler ve takım liderleri için Türkçe yapay zeka promptları. 1:1 toplantı planı, performans geri bildirimi, hedef belirleme ve karar matrisi için hazır komutlar.',
    keywords: [
      'yönetici prompt',
      'takım lideri prompt',
      'manager prompt',
      'leadership prompt',
    ],
    tags: ['yönetim', 'liderlik', '1:1', 'performans', 'strateji'],
  },
  {
    slug: 'avukat',
    title: 'Avukatlar İçin Promptlar',
    description:
      'Avukatlar ve hukuk profesyonelleri için Türkçe yapay zeka promptları. Sözleşme taslağı, hukuki analiz özeti, dilekçe ve müvekkil iletişimi için hazır komutlar.',
    keywords: [
      'avukat prompt',
      'hukuk prompt',
      'sözleşme prompt',
      'avukat için chatgpt',
    ],
    tags: ['hukuk', 'avukat', 'sözleşme', 'dilekçe', 'kanun'],
  },
  {
    slug: 'doktor',
    title: 'Hekimler ve Sağlık Çalışanları İçin Promptlar',
    description:
      'Hekimler ve sağlık profesyonelleri için Türkçe yapay zeka promptları. Hasta bilgilendirme, makale özetleme ve klinik notu yapılandırma için hazır komutlar.',
    keywords: [
      'doktor prompt',
      'sağlık prompt',
      'hekim için chatgpt',
      'tıp prompt',
    ],
    tags: ['sağlık', 'doktor', 'hasta', 'klinik', 'tıp'],
  },
  {
    slug: 'muhasebeci',
    title: 'Muhasebeciler ve Mali Müşavirler İçin Promptlar',
    description:
      'Muhasebe ve mali müşavirlik profesyonelleri için Türkçe yapay zeka promptları. Rapor özeti, e-fatura açıklaması ve müşteri iletişimi için hazır komutlar.',
    keywords: [
      'muhasebeci prompt',
      'mali müşavir prompt',
      'muhasebe için chatgpt',
    ],
    tags: ['muhasebe', 'mali müşavir', 'fatura', 'vergi', 'finans'],
  },
  {
    slug: 'gazeteci',
    title: 'Gazeteciler İçin Promptlar',
    description:
      'Gazeteci ve editörler için Türkçe yapay zeka promptları. Haber başlığı, lead, röportaj sorusu ve özetleme için hazır komutlar.',
    keywords: [
      'gazeteci prompt',
      'haber prompt',
      'editör prompt',
      'röportaj sorusu prompt',
    ],
    tags: ['gazetecilik', 'haber', 'editör', 'röportaj', 'içerik'],
  },
  {
    slug: 'arastirmaci',
    title: 'Akademisyenler ve Araştırmacılar İçin Promptlar',
    description:
      'Akademisyen ve araştırmacılar için Türkçe yapay zeka promptları. Literatür taraması, abstract yazımı, methodology ve hakem cevabı için hazır komutlar.',
    keywords: [
      'araştırmacı prompt',
      'akademisyen prompt',
      'akademik makale prompt',
      'literatür taraması prompt',
    ],
    tags: ['akademik', 'araştırma', 'makale', 'tez', 'literatür'],
  },
  {
    slug: 'cevirmen',
    title: 'Çevirmenler İçin Promptlar',
    description:
      'Çevirmenler için Türkçe yapay zeka promptları. Bağlama uygun çeviri, terminoloji tutarlılığı, post-editing ve glossary için hazır komutlar.',
    keywords: [
      'çevirmen prompt',
      'çeviri prompt',
      'translator prompt',
      'post editing prompt',
    ],
    tags: ['çeviri', 'translation', 'lokalizasyon', 'terminoloji'],
  },
  {
    slug: 'mimari',
    title: 'Mimar ve İç Mimarlar İçin Promptlar',
    description:
      'Mimar ve iç mimarlar için Türkçe yapay zeka promptları. Konsept tasarımı, malzeme önerisi, görsel render brief ve müşteri sunumu için hazır komutlar.',
    keywords: [
      'mimari prompt',
      'iç mimar prompt',
      'mimar için chatgpt',
      'konsept tasarım prompt',
    ],
    tags: ['mimari', 'iç mimar', 'tasarım', 'konsept'],
  },
  {
    slug: 'emlakci',
    title: 'Emlakçılar İçin Promptlar',
    description:
      'Emlak danışmanları için Türkçe yapay zeka promptları. İlan metni, sosyal medya gönderisi, müşteri takibi ve mahalle açıklaması için hazır komutlar.',
    keywords: ['emlakçı prompt', 'emlak ilan prompt', 'gayrimenkul prompt'],
    tags: ['emlak', 'gayrimenkul', 'ilan', 'satış'],
  },
  {
    slug: 'eticaret-satici',
    title: 'E-Ticaret Satıcıları İçin Promptlar',
    description:
      'E-ticaret satıcıları için Türkçe yapay zeka promptları. Ürün açıklaması, başlık, kategori metni, müşteri yorumu cevabı ve kampanya için hazır komutlar.',
    keywords: [
      'e-ticaret prompt',
      'ürün açıklaması prompt',
      'trendyol prompt',
      'amazon prompt',
    ],
    tags: ['e-ticaret', 'ürün', 'kampanya', 'müşteri', 'trendyol'],
  },
];

export function getAllProfessionSlugs(): string[] {
  return PROFESSIONS.map((p) => p.slug);
}

export function getProfessionBySlug(
  slug: string,
): ProfessionDefinition | undefined {
  return PROFESSIONS.find((p) => p.slug === slug);
}

export function getProfessionPath(profession: ProfessionDefinition): string {
  return `/meslek/${profession.slug}`;
}

export function matchPromptsForProfession(
  prompts: PromptResponse[],
  profession: ProfessionDefinition,
): PromptResponse[] {
  const normalizedTags = new Set(
    profession.tags.map((tag) => normalizeQuery(tag)),
  );

  return prompts
    .filter((prompt) =>
      prompt.tags.some((tag) => normalizedTags.has(normalizeQuery(tag))),
    )
    .sort((a, b) => {
      const likeDiff = b.like_count - a.like_count;
      if (likeDiff !== 0) return likeDiff;
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
}
