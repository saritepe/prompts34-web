export interface GlossaryEntry {
  slug: string;
  term: string;
  shortDefinition: string;
  body: string;
  keywords: string[];
  relatedTopicSlugs?: string[];
  relatedGuideSlugs?: string[];
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    slug: 'prompt-nedir',
    term: 'Prompt Nedir?',
    shortDefinition:
      'Prompt, bir yapay zeka modeline ne yapmasını istediğinizi anlatan metin tabanlı talimattır.',
    body: "Prompt; ChatGPT, Claude, Gemini gibi büyük dil modellerine veya Midjourney, DALL·E gibi görsel modellere verdiğiniz girdiye verilen isimdir. Modelin çıktısının kalitesi büyük ölçüde prompt'un netliğine, sağladığınız bağlama ve istediğiniz formatın açık tarif edilmesine bağlıdır. İyi bir prompt; rolü, görevi, beklenen çıktı formatını ve gerekli kısıtlamaları tek bir akışta belirtir. Türkçe prompt yazarken, modelin Türkçe çıktı vermesi için dili ve hedef kitleyi açıkça belirtmek faydalıdır.",
    keywords: ['prompt nedir', 'prompt ne demek', 'prompt anlamı', 'prompt'],
    relatedGuideSlugs: ['iyi-prompt-nasil-yazilir'],
  },
  {
    slug: 'prompt-muhendisligi',
    term: 'Prompt Mühendisliği',
    shortDefinition:
      'Yapay zeka modellerinden tutarlı ve yüksek kaliteli çıktı almak için prompt tasarlama disiplinidir.',
    body: "Prompt mühendisliği (prompt engineering); rol verme, few-shot örnek ekleme, chain-of-thought tetikleme, çıktı şeması belirleme ve değerlendirme adımlarını içerir. Bir prompt mühendisi; model sınırlarını, token bütçesini, halüsinasyon risklerini ve değerlendirme metriklerini birlikte düşünür. Prompt mühendisliği; bir kerelik denemelerden çok, sürüm kontrollü prompt'lar, A/B testleri ve değerlendirme setleriyle iyileşen sistematik bir süreçtir.",
    keywords: [
      'prompt mühendisliği',
      'prompt engineering',
      'prompt engineering nedir',
    ],
    relatedGuideSlugs: ['prompt-muhendisligi', 'iyi-prompt-nasil-yazilir'],
  },
  {
    slug: 'few-shot-prompting',
    term: 'Few-Shot Prompting',
    shortDefinition:
      'Modele birkaç örnek vererek istenen çıktı formatını öğrettiğiniz prompt tekniğidir.',
    body: "Few-shot prompting'de modele görevi açıklayan 2-5 örnek girdi ve çıktı çifti verirsiniz. Model bu örneklerden formatı, tonu ve mantığı çıkarır ve yeni girdileri aynı şekilde işler. Sınıflandırma, çıkarım, format dönüştürme ve stilize etme gibi görevlerde zero-shot'a göre belirgin biçimde daha tutarlı sonuç verir. Few-shot örnekleri seçerken; çeşitliliği, sınır durumları kapsamasını ve gerçek üretim verisine yakınlığı gözetin.",
    keywords: ['few-shot', 'few shot prompting', 'örnekli prompt'],
  },
  {
    slug: 'zero-shot-prompting',
    term: 'Zero-Shot Prompting',
    shortDefinition:
      'Hiç örnek vermeden, sadece talimatla modelden çıktı istediğiniz prompt tekniğidir.',
    body: "Zero-shot prompting; modelin önceden eğitildiği bilgiyi kullanarak görevi sadece doğal dil talimatıyla çözmesini hedefler. Hızlı, yazımı kolay ve token açısından ekonomiktir; ancak özellikle nüanslı görevlerde format tutarsızlığı görülebilir. Çıktıyı stabilize etmek için talimatın net olması, beklenen formatın anlatılması ve gerekirse tek satırlık bir 'output template' eklenmesi yardımcı olur.",
    keywords: ['zero-shot', 'zero shot prompting'],
  },
  {
    slug: 'sistem-promptu',
    term: 'Sistem Promptu',
    shortDefinition:
      'Modelin kişiliğini, kurallarını ve sınırlarını belirleyen üst düzey talimattır.',
    body: 'Sistem promptu (system prompt); model her kullanıcı mesajına yanıt verirken arka planda kullandığı kalıcı talimatlardır. Burada modelin rolünü ("kıdemli içerik editörüsün"), tonunu, kullanması gereken dili, asla yapmaması gerekenleri ve çıktı formatını tanımlarsınız. Kullanıcı promptlarına göre daha güçlü etkiye sahiptir ve uygulamalarda davranış kontrolünün ana aracıdır.',
    keywords: ['sistem promptu', 'system prompt', 'system message'],
  },
  {
    slug: 'rol-promptu',
    term: 'Rol Promptu',
    shortDefinition:
      'Modele belirli bir uzman rolü atayarak çıktının tonunu ve derinliğini yönlendirmektir.',
    body: '"Sen kıdemli bir SEO uzmanısın" gibi rol atamaları, modelin kelime seçimini, vurguladığı detayları ve yapı kurma biçimini belirgin biçimde değiştirir. Rol promptu; sistem promptunun bir parçası olarak veya kullanıcı mesajının ilk satırı olarak verilebilir. En etkili kullanım; rolü, hedef kitleyi ve başarı kriterini birlikte belirtmektir.',
    keywords: ['rol promptu', 'role prompt', 'persona prompt'],
  },
  {
    slug: 'chain-of-thought',
    term: 'Chain-of-Thought (CoT)',
    shortDefinition:
      'Modeli adım adım düşünmeye teşvik ederek karmaşık problemlerde doğruluğu artıran tekniktir.',
    body: '"Adım adım düşün" veya "önce muhakemeyi yaz, sonra cevabı ver" gibi yönlendirmeler chain-of-thought (CoT) tekniğidir. Aritmetik, mantık, çok adımlı çıkarım ve karar verme görevlerinde tek seferlik cevap istemeye göre belirgin biçimde daha doğru sonuç verir. Modern modellerde benzer etki "muhakeme" (reasoning) modeliyle de elde edilir; bu durumda CoT zaten içeride çalışır ve prompt sade tutulur.',
    keywords: ['chain of thought', 'cot prompt', 'adım adım düşün'],
  },
  {
    slug: 'rag',
    term: 'RAG (Retrieval-Augmented Generation)',
    shortDefinition:
      'Modelin cevap üretirken kendi belge tabanınızdan ilgili pasajları getirip kullandığı yaklaşımdır.',
    body: 'RAG; bir kullanıcı sorusunu önce vektör veritabanında ararken (embedding tabanlı), bulunan pasajları prompt\'a ekler ve modelin cevabı bu kaynaklara dayanarak üretmesini sağlar. Halüsinasyonu azaltır, modelin bilmediği güncel bilgileri kullanmasına izin verir ve kaynak gösterimini kolaylaştırır. Pratikte; chunk boyutu, embedding kalitesi ve "context window" yönetimi RAG performansını belirler.',
    keywords: ['rag', 'retrieval augmented generation', 'rag nedir'],
  },
  {
    slug: 'token',
    term: 'Token',
    shortDefinition:
      'Yapay zeka modellerinin metni işlerken kullandığı en küçük birim — kabaca 4 karakterlik veya kelimenin parçası.',
    body: "Token; bir kelime, kelime parçası veya noktalama işareti olabilir. İngilizce'de 1000 token ortalama 750 kelimedir; Türkçe'de oran daha düşük olabilir çünkü Türkçe sondan eklemeli yapısı nedeniyle daha fazla parçaya bölünür. Modeller; girdi + çıktı toplamında bir token sınırına sahiptir (context window). Maliyet ve hız da token başına hesaplandığı için prompt'un kısa ve öz olması doğrudan ekonomik etki yapar.",
    keywords: ['token', 'token nedir', 'context window'],
  },
  {
    slug: 'halusinasyon',
    term: 'Halüsinasyon',
    shortDefinition:
      'Yapay zeka modelinin gerçek olmayan bilgiyi emin bir tonla üretmesidir.',
    body: 'Halüsinasyon; modelin uydurduğu kaynak, isim, tarih veya sayıyı doğru gibi sunmasıdır. Bilgi tabanı ezbere alındığı, kaynak gösterimi olmadığı ve istatistiksel örüntü kelimelerinin "akla yatkın" göründüğü için ortaya çıkar. Azaltmak için: kaynak gösterimi isteyin, RAG kullanın, kritik bilgileri promp\'a kendiniz verin ve modelden "emin değilsem söyle" gibi koşul ekleyin.',
    keywords: ['halüsinasyon', 'hallucination', 'yapay zeka hata'],
  },
  {
    slug: 'jailbreak',
    term: 'Jailbreak',
    shortDefinition:
      'Modelin güvenlik kurallarını aşmak için tasarlanmış prompt tekniklerine verilen isimdir.',
    body: 'Jailbreak; rol değiştirme, hayali senaryo kurma veya talimat enjeksiyonu yoluyla modelin reddedeceği içerikleri üretmesini hedefler. Modern modellerde sistem düzeyinde önlemler ve "instruction hierarchy" mekanizmaları bu denemeleri büyük oranda engeller. Geliştiriciler için ana savunma; kullanıcı girdisini sistem promptundan ayırmak ve kullanıcının sistem talimatlarını "override" edemediği bir tasarım yapmaktır.',
    keywords: ['jailbreak', 'prompt injection', 'jailbreak prompt'],
  },
  {
    slug: 'temperature',
    term: 'Temperature',
    shortDefinition:
      'Modelin çıktısının ne kadar yaratıcı/rastgele olacağını belirleyen 0 ile 2 arasındaki parametredir.',
    body: '0\'a yakın temperature değerleri tutarlı, deterministik ve "güvenli" çıktılar üretir; 1.0 standart yaratıcılık seviyesidir; 1.5+ değerler şiir, beyin fırtınası, alternatif başlık üretimi gibi yaratıcı görevlerde uygundur. Veri çıkarımı, kod üretimi ve yapılandırılmış cevaplarda 0-0.3, içerik üretiminde 0.6-0.9 arası önerilir.',
    keywords: ['temperature', 'temperature nedir', 'model parametresi'],
  },
  {
    slug: 'top-p',
    term: 'Top-p (Nucleus Sampling)',
    shortDefinition:
      "Modelin bir sonraki token'ı seçerken dikkate alacağı olasılık kümesini sınırlandıran parametredir.",
    body: "Top-p (örneğin 0.9), modelin yalnızca toplam olasılığı %90'a ulaşan en olası token'lar arasından örnekleme yapmasını sağlar. Temperature ile birlikte kullanılır ve genelde ikisinden birini sabitlemek daha öngörülebilir sonuç verir. Yaratıcı görevlerde 0.9-0.95, hassas görevlerde 0.5-0.7 tipik değerlerdir.",
    keywords: ['top-p', 'top p', 'nucleus sampling'],
  },
  {
    slug: 'embedding',
    term: 'Embedding',
    shortDefinition:
      'Bir metin parçasını anlamsal olarak temsil eden, sabit uzunluklu sayı vektörüdür.',
    body: "Embedding'ler; arama (semantic search), sınıflandırma, öneri sistemleri ve RAG'ın temel yapı taşıdır. Aynı anlama gelen iki cümle, vektör uzayında birbirine yakın embedding'lere sahip olur. Embedding modeli seçimi (örneğin text-embedding-3-large), boyut (örneğin 1536) ve normalleşme; arama kalitesini doğrudan etkiler.",
    keywords: ['embedding', 'embedding nedir', 'vektör'],
  },
  {
    slug: 'fine-tuning',
    term: 'Fine-Tuning',
    shortDefinition:
      'Hazır bir modeli, kendi verinizle ek eğitime tabi tutarak göreve özel hale getirmektir.',
    body: 'Fine-tuning; özellikle ton, format tutarlılığı ve niş alan terminolojisinin kritik olduğu durumlarda etkilidir. Ancak çoğu kullanım senaryosunda daha hızlı ve ucuz bir alternatif olan iyi tasarlanmış prompt + RAG benzer kaliteyi verir. Fine-tuning öncesi; veri kalitesi, etiket tutarlılığı ve değerlendirme seti vazgeçilmezdir.',
    keywords: ['fine-tuning', 'fine tuning', 'model eğitimi'],
  },
];

export function getAllGlossarySlugs(): string[] {
  return GLOSSARY.map((entry) => entry.slug);
}

export function getGlossaryBySlug(slug: string): GlossaryEntry | undefined {
  return GLOSSARY.find((entry) => entry.slug === slug);
}

export function getGlossaryPath(entry: GlossaryEntry): string {
  return `/sozluk/${entry.slug}`;
}
