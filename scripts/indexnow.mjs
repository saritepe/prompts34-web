const KEY = '92c448d7f54a4ad088ddf9883d74c1dc';
const BASE_URL = 'https://prompts34.com';

const urls = [
  BASE_URL,
  // Tool hubs
  `${BASE_URL}/araclar`,
  `${BASE_URL}/araclar/chatgpt-promptlari`,
  `${BASE_URL}/araclar/gemini-promptlari`,
  `${BASE_URL}/araclar/claude-promptlari`,
  `${BASE_URL}/araclar/copilot-promptlari`,
  // Discovery pages
  `${BASE_URL}/en-yeni-prompts`,
  `${BASE_URL}/one-cikanlar`,
  `${BASE_URL}/ucretsiz-promptlar`,
  `${BASE_URL}/prompts`,
  // Categories hub + all category pages
  `${BASE_URL}/kategori`,
  `${BASE_URL}/kategori/cv-hazirlama`,
  `${BASE_URL}/kategori/motivasyon-mektubu`,
  `${BASE_URL}/kategori/mulakat-hazirligi`,
  `${BASE_URL}/kategori/gorsel-olusturma`,
  `${BASE_URL}/kategori/logo-olusturma`,
  `${BASE_URL}/kategori/oyun`,
  `${BASE_URL}/kategori/pazarlama-ve-icerik`,
  `${BASE_URL}/kategori/sanat-ve-yaraticilik`,
  `${BASE_URL}/kategori/portre-ve-fotograf`,
  `${BASE_URL}/kategori/is-stratejisi`,
  `${BASE_URL}/kategori/yazilim-gelistirme`,
  `${BASE_URL}/kategori/midjourney-gorsel`,
  `${BASE_URL}/kategori/kariyer-gelisim`,
  `${BASE_URL}/kategori/egitim`,
  `${BASE_URL}/kategori/sosyal-medya`,
  `${BASE_URL}/kategori/e-ticaret`,
  `${BASE_URL}/kategori/uretkenlik`,
  `${BASE_URL}/kategori/e-posta`,
];

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: 'prompts34.com',
    key: KEY,
    keyLocation: `${BASE_URL}/${KEY}.txt`,
    urlList: urls,
  }),
});

console.log(`IndexNow: ${res.status} ${res.statusText}`);
console.log(`Submitted ${urls.length} URLs`);
