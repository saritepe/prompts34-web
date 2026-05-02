import type { PromptResponse } from '@/types/prompt';
import { normalizeQuery } from '@/lib/topics';

export interface UseCaseDefinition {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  tags: string[];
}

export const USE_CASES: UseCaseDefinition[] = [
  {
    slug: 'email-yazma',
    title: 'E-posta Yazma Promptları',
    description:
      'İş, müşteri, takip ve özür e-postaları için Türkçe yapay zeka promptları. ChatGPT ve Claude ile profesyonel ve kişiselleştirilmiş e-postalar yazın.',
    keywords: [
      'e-posta yazma prompt',
      'mail yazma prompt',
      'iş emaili prompt',
      'profesyonel email prompt',
    ],
    tags: ['email', 'e-posta', 'mail', 'yazışma'],
  },
  {
    slug: 'instagram-icerigi',
    title: 'Instagram İçeriği Promptları',
    description:
      'Instagram caption, reel senaryosu, hashtag ve gönderi fikri için Türkçe yapay zeka promptları. Etkileşim odaklı içerikler için hazır komutlar.',
    keywords: [
      'instagram caption prompt',
      'instagram içerik prompt',
      'reel senaryo prompt',
      'instagram hashtag',
    ],
    tags: ['instagram', 'caption', 'reel', 'sosyal medya'],
  },
  {
    slug: 'linkedin-gonderisi',
    title: 'LinkedIn Gönderisi Promptları',
    description:
      'LinkedIn için profesyonel post, makale ve hikâye anlatımı promptları. Kariyer hareketi, başarı paylaşımı ve sektör yorumu için Türkçe komutlar.',
    keywords: [
      'linkedin post prompt',
      'linkedin gönderisi prompt',
      'linkedin yazı prompt',
      'profesyonel post prompt',
    ],
    tags: ['linkedin', 'post', 'kariyer', 'profesyonel'],
  },
  {
    slug: 'urun-aciklamasi',
    title: 'Ürün Açıklaması Promptları',
    description:
      'E-ticaret ürün açıklaması, özellik listesi ve faydaya dönüştürme için Türkçe yapay zeka promptları. Trendyol, Hepsiburada, Amazon için optimize.',
    keywords: [
      'ürün açıklaması prompt',
      'e-ticaret prompt',
      'ürün metni prompt',
      'trendyol ürün prompt',
    ],
    tags: ['ürün açıklaması', 'e-ticaret', 'ürün', 'satış metni'],
  },
  {
    slug: 'blog-yazisi',
    title: 'Blog Yazısı Promptları',
    description:
      'SEO uyumlu blog yazısı, başlık, outline ve giriş paragrafı için Türkçe yapay zeka promptları. ChatGPT ve Claude ile blog içeriği üretin.',
    keywords: [
      'blog yazısı prompt',
      'seo blog prompt',
      'içerik üretim prompt',
      'blog başlığı prompt',
    ],
    tags: ['blog', 'seo', 'içerik', 'yazı'],
  },
  {
    slug: 'sunum-hazirlama',
    title: 'Sunum Hazırlama Promptları',
    description:
      'PowerPoint, Keynote ve Google Slides için sunum yapısı, slayt başlıkları, anekdot ve özet promptları. Toplantı ve pitch sunumları için hazır komutlar.',
    keywords: [
      'sunum prompt',
      'powerpoint prompt',
      'pitch deck prompt',
      'sunum hazırlama prompt',
    ],
    tags: ['sunum', 'pitch', 'powerpoint', 'slayt'],
  },
  {
    slug: 'ders-plani',
    title: 'Ders Planı Promptları',
    description:
      'Öğretmenler için Türkçe ders planı, etkinlik ve değerlendirme promptları. Sınıf seviyesine uygun, MEB müfredatına yakın komutlar.',
    keywords: [
      'ders planı prompt',
      'eğitim prompt',
      'öğretmen prompt',
      'müfredat prompt',
    ],
    tags: ['ders planı', 'eğitim', 'okul', 'müfredat', 'öğretmen'],
  },
  {
    slug: 'ozet-cikarma',
    title: 'Özet Çıkarma Promptları',
    description:
      'Uzun makale, kitap, rapor ve toplantı kaydı için Türkçe özet çıkarma promptları. Anahtar fikirleri, kararları ve aksiyon maddelerini çıkarın.',
    keywords: [
      'özet çıkarma prompt',
      'özetleme prompt',
      'metin özeti prompt',
      'rapor özeti prompt',
    ],
    tags: ['özet', 'özetleme', 'rapor'],
  },
  {
    slug: 'ceviri',
    title: 'Çeviri Promptları',
    description:
      'Bağlama uygun ve doğal Türkçe çeviri için yapay zeka promptları. Teknik, hukuki, edebî ve pazarlama metni çevirilerinde tutarlılık sağlayan komutlar.',
    keywords: [
      'çeviri prompt',
      'türkçe çeviri prompt',
      'translator prompt',
      'lokalizasyon prompt',
    ],
    tags: ['çeviri', 'translation', 'lokalizasyon', 'dil'],
  },
  {
    slug: 'kod-aciklama',
    title: 'Kod Açıklama Promptları',
    description:
      'Var olan kodu satır satır açıklayan, refactoring fikri sunan ve dökümantasyon üreten Türkçe yapay zeka promptları.',
    keywords: [
      'kod açıklama prompt',
      'code review prompt',
      'refactoring prompt',
      'kod dökümantasyon prompt',
    ],
    tags: ['kod', 'yazılım', 'code review', 'dökümantasyon'],
  },
  {
    slug: 'sql-sorgusu',
    title: 'SQL Sorgusu Promptları',
    description:
      'Doğal dilden SQL sorgusu üretme, JOIN stratejisi önerme ve query optimizasyonu için Türkçe yapay zeka promptları.',
    keywords: [
      'sql prompt',
      'sql sorgusu prompt',
      'sql üretme prompt',
      'database prompt',
    ],
    tags: ['sql', 'veritabanı', 'database', 'sorgu'],
  },
  {
    slug: 'regex',
    title: 'Regex Promptları',
    description:
      'Metin yakalama, doğrulama ve ayıklama için regex deseni üreten yapay zeka promptları. Test örnekleriyle birlikte hazır komutlar.',
    keywords: ['regex prompt', 'düzenli ifade prompt', 'regex üretme prompt'],
    tags: ['regex', 'düzenli ifade', 'metin işleme'],
  },
  {
    slug: 'ilan-metni',
    title: 'İş İlanı Metni Promptları',
    description:
      'İK uzmanları için iş ilanı, pozisyon tanımı ve ilan metni hazırlama Türkçe promptları. Aday çekmeye yönelik etkili duyurular yazın.',
    keywords: [
      'iş ilanı prompt',
      'ilan metni prompt',
      'pozisyon tanımı prompt',
    ],
    tags: ['iş ilanı', 'ik', 'işe alım', 'ilan'],
  },
  {
    slug: 'mulakat-sorulari',
    title: 'Mülakat Sorusu Promptları',
    description:
      'Mülakat soruları üretme ve aday değerlendirmesi için Türkçe yapay zeka promptları. Pozisyona, seviyeye ve değerlere göre özelleştirilebilir komutlar.',
    keywords: [
      'mülakat sorusu prompt',
      'interview prompt',
      'mülakat hazırlığı prompt',
    ],
    tags: ['mülakat', 'interview', 'işe alım'],
  },
  {
    slug: 'sosyal-medya-kampanyasi',
    title: 'Sosyal Medya Kampanyası Promptları',
    description:
      'Sosyal medya kampanya konsepti, içerik takvimi ve gönderi varyasyonları için Türkçe yapay zeka promptları.',
    keywords: [
      'sosyal medya kampanyası prompt',
      'kampanya prompt',
      'içerik takvimi prompt',
    ],
    tags: ['sosyal medya', 'kampanya', 'içerik takvimi', 'pazarlama'],
  },
  {
    slug: 'reklam-metni',
    title: 'Reklam Metni Promptları',
    description:
      'Google Ads, Meta Ads ve display reklamlar için başlık, açıklama ve CTA üreten Türkçe yapay zeka promptları.',
    keywords: [
      'reklam metni prompt',
      'google ads prompt',
      'meta ads prompt',
      'reklam başlığı prompt',
    ],
    tags: ['reklam', 'google ads', 'meta ads', 'copywriting'],
  },
  {
    slug: 'soguk-email',
    title: 'Soğuk E-posta Promptları',
    description:
      'B2B satış için soğuk e-posta, takip e-postası ve ICP-bazlı kişiselleştirme Türkçe promptları. Açılma ve cevap oranını artıran komutlar.',
    keywords: [
      'soğuk email prompt',
      'cold email prompt',
      'b2b email prompt',
      'satış emaili prompt',
    ],
    tags: ['soğuk email', 'satış', 'b2b', 'sales'],
  },
  {
    slug: 'musteri-yorumu-cevabi',
    title: 'Müşteri Yorumu Cevabı Promptları',
    description:
      'Olumlu ve olumsuz müşteri yorumlarına profesyonel cevap üreten Türkçe yapay zeka promptları. Trendyol, Google ve sosyal medya için.',
    keywords: [
      'müşteri yorumu cevabı prompt',
      'şikayet cevabı prompt',
      'review cevabı prompt',
    ],
    tags: ['müşteri', 'yorum', 'müşteri hizmetleri', 'şikayet'],
  },
  {
    slug: 'beyin-firtinasi',
    title: 'Beyin Fırtınası Promptları',
    description:
      'Yeni fikir, alternatif çözüm ve yaratıcı senaryo üretmek için Türkçe yapay zeka promptları. Ürün, içerik ve iş fikirlerinde sıfırdan başlamayı kolaylaştırır.',
    keywords: [
      'beyin fırtınası prompt',
      'fikir üretme prompt',
      'brainstorm prompt',
    ],
    tags: ['beyin fırtınası', 'fikir', 'yaratıcılık', 'brainstorm'],
  },
  {
    slug: 'gorsel-prompt',
    title: 'Görsel Üretimi Promptları',
    description:
      'Midjourney, DALL·E ve Stable Diffusion için Türkçe görsel üretim promptları. Portre, ürün, manzara ve sosyal medya görselleri için hazır komutlar.',
    keywords: [
      'görsel prompt',
      'midjourney prompt',
      'dalle prompt',
      'görsel üretme prompt',
    ],
    tags: ['görsel', 'midjourney', 'dalle', 'image'],
  },
  {
    slug: 'logo-fikri',
    title: 'Logo Fikri Promptları',
    description:
      'Marka kişiliğine uygun logo konsepti, sembol ve renk paleti öneren Türkçe yapay zeka promptları.',
    keywords: [
      'logo prompt',
      'logo tasarım prompt',
      'marka prompt',
      'logo fikri prompt',
    ],
    tags: ['logo', 'marka', 'tasarım', 'identity'],
  },
  {
    slug: 'arastirma-ozet',
    title: 'Araştırma Özeti Promptları',
    description:
      'Akademik makale, rapor ve araştırma dökümanlarını yapılandırılmış biçimde özetleyen Türkçe yapay zeka promptları.',
    keywords: [
      'araştırma özeti prompt',
      'makale özeti prompt',
      'literatür özeti prompt',
    ],
    tags: ['araştırma', 'akademik', 'makale', 'özet'],
  },
  {
    slug: 'is-plani',
    title: 'İş Planı Promptları',
    description:
      'Girişimciler için iş planı bölümleri, pazar analizi ve gelir modeli oluşturan Türkçe yapay zeka promptları.',
    keywords: ['iş planı prompt', 'business plan prompt', 'startup prompt'],
    tags: ['iş planı', 'startup', 'girişim', 'business'],
  },
  {
    slug: 'ozgecmis-yazma',
    title: 'Özgeçmiş Yazma Promptları',
    description:
      'ATS uyumlu özgeçmiş, başarı maddesi, profesyonel özet ve pozisyona göre anahtar kelime optimizasyonu için Türkçe yapay zeka promptları.',
    keywords: [
      'özgeçmiş prompt',
      'cv prompt',
      'ats cv prompt',
      'özgeçmiş yazma prompt',
    ],
    tags: ['cv', 'özgeçmiş', 'ats', 'kariyer'],
  },
  {
    slug: 'youtube-senaryosu',
    title: 'YouTube Senaryosu Promptları',
    description:
      'YouTube videoları için intro, gövde ve outro içeren senaryo, başlık ve açıklama promptları. Long-form ve Shorts için Türkçe komutlar.',
    keywords: [
      'youtube senaryo prompt',
      'video script prompt',
      'youtube içerik prompt',
    ],
    tags: ['youtube', 'video', 'senaryo', 'içerik'],
  },
];

export function getAllUseCaseSlugs(): string[] {
  return USE_CASES.map((u) => u.slug);
}

export function getUseCaseBySlug(slug: string): UseCaseDefinition | undefined {
  return USE_CASES.find((u) => u.slug === slug);
}

export function getUseCasePath(useCase: UseCaseDefinition): string {
  return `/kullanim/${useCase.slug}`;
}

export function matchPromptsForUseCase(
  prompts: PromptResponse[],
  useCase: UseCaseDefinition,
): PromptResponse[] {
  const normalizedTags = new Set(
    useCase.tags.map((tag) => normalizeQuery(tag)),
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
