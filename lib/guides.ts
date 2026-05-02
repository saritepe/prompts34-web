export interface GuideStep {
  name: string;
  body: string;
}

export interface GuideFAQ {
  question: string;
  answer: string;
}

export interface GuideDefinition {
  slug: string;
  title: string;
  shortDescription: string;
  intro: string;
  keywords: string[];
  steps: GuideStep[];
  conclusion: string;
  faqs?: GuideFAQ[];
  datePublished?: string;
  dateModified?: string;
  relatedTopicSlugs?: string[];
  relatedToolHubSlugs?: string[];
  relatedGlossarySlugs?: string[];
}

const GUIDE_PUBLISHED = '2026-05-02';
const GUIDE_MODIFIED = '2026-05-02';

export const GUIDES: GuideDefinition[] = [
  {
    slug: 'iyi-prompt-nasil-yazilir',
    title: 'İyi Bir Prompt Nasıl Yazılır?',
    shortDescription:
      'ChatGPT, Claude, Gemini ve diğer yapay zeka araçlarından tutarlı çıktı almak için iyi prompt yazma rehberi.',
    intro:
      "İyi prompt; modelin tahmin değil, sizin istediğiniz şeyi üretmesini sağlar. Bu rehberde 6 adımda Türkçe yapay zeka promptu nasıl yazılır ve hangi tuzaklara dikkat etmek gerekir, örneklerle anlatıyoruz. Adımları sırayla uygularsanız basit bir 'özetle bunu' isteğini, üretim kalitesinde bir prompt'a dönüştürebilirsiniz.",
    keywords: [
      'iyi prompt nasıl yazılır',
      'prompt yazma rehberi',
      'prompt nasıl yazılır',
      'türkçe prompt rehberi',
      'chatgpt prompt rehberi',
    ],
    steps: [
      {
        name: 'Rolü ve hedefi netleştirin',
        body: "Prompt'un ilk satırında modelin hangi rolde olduğunu ve hangi sonucu hedeflediğini açıkça yazın. Örnek: 'Sen 10 yıllık deneyimli bir teknik içerik editörüsün. Aşağıdaki taslağı SEO uyumlu bir blog yazısına dönüştür.'",
      },
      {
        name: 'Bağlamı ve girdiyi açık verin',
        body: 'Modelin tahmin etmesini istemediğiniz her şeyi prompt içinde belirtin: hedef kitle, ton, dil, sektör, sınırlamalar. Eksik bağlam, halüsinasyonun en sık nedenidir.',
      },
      {
        name: 'Beklediğiniz çıktı formatını anlatın',
        body: 'Liste mi, tablo mu, JSON mu, Markdown mı? Kaç başlık olsun? Her başlık altında ne yazsın? Format ne kadar açık olursa, model o kadar tutarlı sonuç verir.',
      },
      {
        name: 'Kısıtları ve yapmaması gerekenleri belirtin',
        body: "'Emoji kullanma', 'tahmin yürütme, sadece verilen bilgiyi kullan', 'azami 250 kelime' gibi kısıtlar; modelin sapmasını engeller. Pozitif talimatlardan çok daha etkili olabilirler.",
      },
      {
        name: 'Örnek (few-shot) ekleyin',
        body: 'Tutarlı format almak istiyorsanız 1-3 örnek girdi/çıktı çifti verin. Few-shot tekniği özellikle sınıflandırma, çıkarım ve format dönüştürme görevlerinde belirgin biçimde daha iyi sonuç verir.',
      },
      {
        name: 'İterasyonla iyileştirin',
        body: "İlk çıktıyı son çıktı sayma. Modelden 'kendisini eleştirmesini' veya 'aynı çıktıyı 2 farklı stilde üretmesini' isteyin, sonra en iyisini seçip prompt'a o yönü ekleyin. İyi prompt; tek seferde değil, 3-5 iterasyonda ortaya çıkar.",
      },
    ],
    conclusion:
      "Bu altı adımı bir checklist olarak kullanın. Prompt'larınızı sürüm kontrolünde tutmaya başladığınızda, neyin neden çalıştığını anlamak çok daha kolaylaşır. Daha fazla örnek için kategorilerimizi ve hazır prompt kütüphanemizi inceleyebilirsiniz.",
    relatedToolHubSlugs: ['chatgpt-promptlari', 'claude-promptlari'],
    relatedGlossarySlugs: [
      'prompt-muhendisligi',
      'few-shot-prompting',
      'rol-promptu',
    ],
    faqs: [
      {
        question: 'İyi bir prompt kaç kelime olmalı?',
        answer:
          'Sabit bir uzunluk yoktur; net olduğu sürece 50 kelime de 500 kelime de iyi olabilir. Önemli olan rol, görev, format ve kısıtların tam olarak belirtilmiş olmasıdır.',
      },
      {
        question:
          'Türkçe prompt yazarken İngilizce kelimeler kullanmalı mıyım?',
        answer:
          'Marka adları ve teknik terimler dışında Türkçe yazın ve modele "tüm teknik terimleri Türkçeye çevir" gibi açık kural verin. Aksi halde model çıktıyı karışık dilde verebilir.',
      },
      {
        question: 'Prompt aynı sonucu her seferinde verir mi?',
        answer:
          "Hayır; temperature ve top-p gibi parametreler nedeniyle çıktı her seferinde biraz farklı olabilir. Tutarlılık için temperature'ı 0'a yakın tutmak ve aynı seed kullanmak gerekir.",
      },
    ],
    datePublished: GUIDE_PUBLISHED,
    dateModified: GUIDE_MODIFIED,
  },
  {
    slug: 'chatgpt-prompt-rehberi',
    title: 'ChatGPT Prompt Rehberi (Türkçe)',
    shortDescription:
      "ChatGPT'den maksimum verim almak için Türkçe prompt yazma teknikleri, örnekler ve sık yapılan hatalar.",
    intro:
      "ChatGPT, OpenAI'ın GPT-4o ve GPT-5 ailesindeki modelleri kullanan, Türkiye'de en yaygın kullanılan yapay zeka aracıdır. Bu rehberde Türkçe prompt yazarken modelin tonunu, format tutarlılığını ve doğruluğunu nasıl artıracağınızı 5 adımda anlatıyoruz.",
    keywords: [
      'chatgpt prompt rehberi',
      'chatgpt türkçe prompt',
      'chatgpt nasıl kullanılır',
      'gpt-4o prompt',
      'chatgpt promptları',
    ],
    steps: [
      {
        name: 'Türkçe çıktı için dili açıkça belirtin',
        body: "ChatGPT İngilizce ağırlıklı eğitilmiştir. Prompt'a 'Türkçe yanıt ver' eklemek yetmeyebilir; çıktının tarzını belirten ek bir cümle ('akıcı, gündelik Türkçe kullan, çeviri kokmasın') tutarlılığı belirgin biçimde artırır.",
      },
      {
        name: 'Sistem mesajını kullanın',
        body: "API veya Custom GPT kullanıyorsanız sistem mesajı; modelin kişiliğini ve sınırlarını belirleyen ana araçtır. Buraya 'Sen X uzmanısın, asla Y yapma, çıktıyı Z formatında ver' gibi kalıcı kuralları yazın.",
      },
      {
        name: 'Uzun görevleri parçalara bölün',
        body: 'Tek bir prompt ile uzun ve karmaşık görevler vermek halüsinasyon riskini artırır. Görevi 3-5 alt göreve bölün, her birinin çıktısını sonraki adıma girdi olarak verin.',
      },
      {
        name: 'Modeli kendi cevabını eleştirmeye yönlendirin',
        body: "İlk cevabı aldıktan sonra 'Bu cevaptaki en zayıf 3 noktayı bul ve düzelt' demek; tek prompt'ta belirgin biçimde daha kaliteli bir çıktı verir. Bu basit ama güçlü bir self-refine tekniğidir.",
      },
      {
        name: 'Veri ve kaynak gerektiren görevlerde dosya yükleyin',
        body: "ChatGPT'nin 'kendisi' dediği bilgilere fazla güvenmeyin. PDF, CSV veya yapıştırılmış metin verirseniz model bu kaynağa dayanarak cevap üretir ve halüsinasyon riski belirgin biçimde azalır.",
      },
    ],
    conclusion:
      "Bu rehberdeki 5 alışkanlığı edinirseniz ChatGPT'den aldığınız çıktının kalitesi belirgin biçimde artar. Hazır ChatGPT promptlarını /araclar/chatgpt-promptlari sayfamızdan inceleyebilirsiniz.",
    relatedToolHubSlugs: ['chatgpt-promptlari'],
    relatedGlossarySlugs: ['sistem-promptu', 'halusinasyon', 'token'],
    faqs: [
      {
        question: 'ChatGPT Türkçe yanıt vermiyor, ne yapmalıyım?',
        answer:
          '"Yanıt dili: Türkçe" gibi açık bir satır ekleyin ve "akıcı, gündelik Türkçe kullan, çeviri kokmasın" cümlesini prompt başına koyun. Custom Instructions kullanıyorsanız aynı kuralı oraya da ekleyin.',
      },
      {
        question: 'Custom GPT ile sistem promptu arasında fark var mı?',
        answer:
          'Custom GPT, sistem promptunu kalıcı hâle getiren bir paketleme yöntemidir. API\'de doğrudan `role: "system"` ile gönderilen mesajla aynı işlevi görür.',
      },
      {
        question: 'ChatGPT için en iyi temperature kaç?',
        answer:
          'Yapılandırılmış çıktı (JSON, kod) için 0-0.2; metin üretimi için 0.6-0.8 önerilir. ChatGPT arayüzü doğrudan ayarlamaya izin vermez; API kullanıyorsanız buradan ayarlayabilirsiniz.',
      },
    ],
    datePublished: GUIDE_PUBLISHED,
    dateModified: GUIDE_MODIFIED,
  },
  {
    slug: 'gemini-prompt-rehberi',
    title: 'Gemini Prompt Rehberi (Türkçe)',
    shortDescription:
      "Google Gemini'den maksimum verim almak için Türkçe prompt yazma teknikleri ve özel ipuçları.",
    intro:
      "Google Gemini; metin, görsel ve uzun bağlam (context window) işleme konusunda güçlüdür. Bu rehberde Gemini Pro ve Flash modelleriyle Türkçe prompt yazarken nelere dikkat etmeniz gerektiğini, hangi görevlerde ChatGPT'den ayrıştığını anlatıyoruz.",
    keywords: [
      'gemini prompt rehberi',
      'gemini türkçe',
      'gemini yapay zeka',
      'google gemini prompt',
      'gemini pro nasıl kullanılır',
    ],
    steps: [
      {
        name: 'Çok modlu güçlü yönü kullanın',
        body: "Gemini görsel + metin işlemede güçlüdür. Görsel yükleyip 'bu grafikten ne çıkıyor' veya 'bu ekran görüntüsündeki UX problemini bul' gibi görevlerde belirgin biçimde iyi performans verir.",
      },
      {
        name: 'Uzun bağlamdan faydalanın',
        body: "Gemini'nin context window'u büyüktür; uzun PDF, kod tabanı veya birden fazla makaleyi tek seferde verebilirsiniz. Bu, RAG kurmadan da derin sorgular yapmanıza imkân verir.",
      },
      {
        name: 'Yapılandırılmış çıktı isteyin',
        body: "Gemini, açıkça istendiğinde JSON ve Markdown çıktısında oldukça tutarlıdır. Şema'yı prompt içinde örnek bir çıktıyla göstermek format tutarlılığını artırır.",
      },
      {
        name: 'Kaynak ve gerekçe isteyin',
        body: "Gemini, Google arama sonuçlarına bağlı olduğunda kaynak gösterimi verebilir. 'Cevabını destekleyen 3 kaynak ekle' veya 'her madde için gerekçe yaz' gibi yönlendirmeler doğruluğu artırır.",
      },
      {
        name: 'Türkçe + İngilizce karışımına dikkat',
        body: "Gemini bazen Türkçe görevlerde İngilizce terim kullanmaya kayar. Prompt'a 'Tüm teknik terimleri Türkçeye çevir, İngilizce sadece marka adlarında kullan' gibi açık bir kural eklemek bu sorunu çözer.",
      },
    ],
    conclusion:
      'Hazır Gemini promptlarını /araclar/gemini-promptlari sayfamızdan inceleyebilir, kendi prompt koleksiyonunuzu oluşturabilirsiniz.',
    relatedToolHubSlugs: ['gemini-promptlari'],
    relatedGlossarySlugs: ['token', 'rag'],
    faqs: [
      {
        question: 'Gemini Pro ile Flash arasındaki fark nedir?',
        answer:
          "Pro yüksek kaliteli muhakeme ve uzun bağlam için, Flash ise hız ve düşük maliyet öncelikli görevler içindir. Aynı prompt Pro'da daha derin yanıt verir; Flash daha hızlı sonuç döner.",
      },
      {
        question: 'Gemini Türkçeyi diğer modellere göre nasıl?',
        answer:
          'Gemini Türkçede güçlüdür ancak teknik terimlerde bazen İngilizceye kayar. Açık dil kuralı eklemek bu sorunu büyük oranda çözer.',
      },
    ],
    datePublished: GUIDE_PUBLISHED,
    dateModified: GUIDE_MODIFIED,
  },
  {
    slug: 'midjourney-prompt-rehberi',
    title: 'Midjourney Prompt Rehberi (Türkçe)',
    shortDescription:
      "Midjourney'den profesyonel kalitede görsel üretmek için Türkçe prompt yazma teknikleri.",
    intro:
      "Midjourney görsel modelleri; konu, kompozisyon, ışık, kamera, stil ve teknik parametrelerin tek bir akışta verilmesiyle çalışır. Bu rehberde Midjourney prompt'unun anatomisini ve sık kullanılan parametreleri Türkçe örneklerle anlatıyoruz.",
    keywords: [
      'midjourney prompt rehberi',
      'midjourney türkçe',
      'midjourney prompt örnekleri',
      'görsel oluşturma prompt',
      'ai görsel prompt',
    ],
    steps: [
      {
        name: 'Konuyu net tanımlayın',
        body: "Prompt'un başında ne çizilmesi gerektiğini açıkça belirtin: 'genç bir kadın portresi', 'modern bir kafe iç mekanı', 'fantastik bir orman manzarası'. Konu netliği, modelin doğru kompozisyonu kurması için en kritik adımdır.",
      },
      {
        name: 'Stil ve sanatçı referansı ekleyin',
        body: "'cinematic', 'oil painting', 'studio photography', 'in the style of [sanatçı]' gibi stil belirteçleri görselin estetiğini doğrudan belirler. Birden fazla stili karıştırmaktan kaçının; bir veya iki güçlü referans yeterlidir.",
      },
      {
        name: 'Işık ve atmosferi tarif edin',
        body: "'soft natural light', 'golden hour', 'dramatic backlight', 'studio lighting with rim light' — ışık tarifi, görselin profesyonel görünmesini sağlayan en önemli faktördür.",
      },
      {
        name: 'Kamera ve kompozisyon parametreleri',
        body: "'shot on Canon R5', '85mm lens', 'shallow depth of field', 'symmetrical composition', 'rule of thirds' — bu teknik parametreler özellikle fotoğraf tarzı görsellerde kaliteyi belirgin biçimde artırır.",
      },
      {
        name: 'Aspect ratio ve teknik bayraklar',
        body: "'--ar 16:9', '--ar 3:4', '--style raw', '--v 6' gibi parametrelerle çıktı oranını ve model versiyonunu kontrol edebilirsiniz. Sosyal medya için 1:1, baskı için 3:4 veya 4:5 önerilir.",
      },
    ],
    conclusion:
      'Görsel oluşturma kategorimizdeki hazır promptları /kategori/gorsel-olusturma sayfasında inceleyebilirsiniz.',
    relatedTopicSlugs: ['gorsel-olusturma', 'logo-olusturma'],
    faqs: [
      {
        question: 'Midjourney Türkçe prompt anlıyor mu?',
        answer:
          'Anlıyor ama İngilizce prompt belirgin biçimde daha tutarlı ve kaliteli sonuç verir. Konuyu Türkçe düşünüp İngilizce yazmak çoğu durumda en iyi sonucu verir.',
      },
      {
        question: '--ar 16:9 gibi parametreler ne işe yarar?',
        answer:
          '--ar görüntü oranını (aspect ratio) belirler. --v model versiyonunu, --style stil profilini, --s stilizasyon seviyesini ayarlar. Bu parametreler promptun sonuna eklenir.',
      },
    ],
    datePublished: GUIDE_PUBLISHED,
    dateModified: GUIDE_MODIFIED,
  },
  {
    slug: 'prompt-muhendisligi',
    title: 'Prompt Mühendisliği Nedir? Başlangıç Rehberi',
    shortDescription:
      'Prompt mühendisliği nedir, nasıl uygulanır ve yapay zeka uygulamaları geliştirirken hangi tekniklerle başlanır?',
    intro:
      'Prompt mühendisliği; yapay zeka modellerinden tutarlı, güvenli ve yüksek kaliteli çıktı almak için prompt tasarlama, test etme ve sürümleme disiplinidir. Bu rehberde temel kavramları, en sık kullanılan teknikleri ve değerlendirme yaklaşımlarını anlatıyoruz.',
    keywords: [
      'prompt mühendisliği',
      'prompt engineering',
      'prompt engineering nedir',
      'prompt mühendisliği rehberi',
    ],
    steps: [
      {
        name: 'Temel kavramlar: prompt, sistem mesajı, few-shot',
        body: 'Prompt, modele verilen tüm girdidir. Sistem mesajı, modelin kişiliğini ve sınırlarını belirler. Few-shot ise birkaç örnekle modeli istenen formatı öğretmektir. Bu üç kavram prompt mühendisliğinin temelidir.',
      },
      {
        name: 'Chain-of-thought ve muhakeme tetikleme',
        body: '"Adım adım düşün" gibi yönlendirmeler; aritmetik, mantık ve çok adımlı çıkarım görevlerinde belirgin biçimde daha doğru sonuç verir. Modern muhakeme modelleri (örneğin o1, o3) bu adımı içeride otomatik yapar.',
      },
      {
        name: 'Yapılandırılmış çıktı: JSON şeması ve format kontrolü',
        body: "Üretim ortamlarında modelden serbest metin yerine JSON ister, şema doğrulamasıyla kontrol edersiniz. OpenAI'ın 'response_format', Anthropic'in 'tool_use' ve Google'ın yapılandırılmış çıktı API'leri bu süreci kolaylaştırır.",
      },
      {
        name: 'Değerlendirme seti ve sürüm kontrolü',
        body: "Prompt'larınızı git'te tutun. 20-100 girdi-beklenen-çıktı çiftinden oluşan bir değerlendirme seti hazırlayın ve her prompt değişikliğinden sonra koşturun. 'Daha iyi gibi göründü' yerine ölçülebilir iyileşme arayın.",
      },
      {
        name: 'Güvenlik: prompt injection ve jailbreak',
        body: "Kullanıcı girdisi alan promptlarda; sistem talimatlarınızı kullanıcının 'override' edemeyeceği şekilde yapılandırın. Prompt'ı önce 'ne tür bir girdi geldi' diye sınıflandıran bir adımla başlatmak, çoğu jailbreak denemesini engeller.",
      },
    ],
    conclusion:
      'Prompt mühendisliği bir kerelik kurulum değil, sürekli iyileşen bir süreçtir. Sözlüğümüzdeki temel terimleri ve diğer rehberleri okuyarak pratiğe başlayabilirsiniz.',
    relatedGlossarySlugs: [
      'prompt-muhendisligi',
      'chain-of-thought',
      'few-shot-prompting',
      'sistem-promptu',
    ],
    faqs: [
      {
        question: 'Prompt mühendisi olmak için hangi becerilere ihtiyaç var?',
        answer:
          'Açık ve net yazma, sistemli düşünme, deneme-değerlendirme alışkanlığı temel becerilerdir. Üretim sistemleri için ek olarak Python/TypeScript, API kullanımı ve değerlendirme metrikleri tasarlama gerekir.',
      },
      {
        question: 'Prompt mühendisliği geçici bir trend mi?',
        answer:
          'Modeller iyileştikçe bazı teknikler (örneğin chain-of-thought) prompta eklenmeden çalışır hâle geliyor. Ancak modele giden tüm girdiyi tasarlama disiplini kalıcıdır; isim değişebilir, iş kalır.',
      },
    ],
    datePublished: GUIDE_PUBLISHED,
    dateModified: GUIDE_MODIFIED,
  },
];

export function getAllGuideSlugs(): string[] {
  return GUIDES.map((g) => g.slug);
}

export function getGuideBySlug(slug: string): GuideDefinition | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function getGuidePath(guide: GuideDefinition): string {
  return `/rehber/${guide.slug}`;
}
