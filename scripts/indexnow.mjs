const KEY = '92c448d7f54a4ad088ddf9883d74c1dc';
const BASE_URL = 'https://prompts34.com';

const urls = [
  BASE_URL,
  `${BASE_URL}/chatgpt-promptlari`,
  `${BASE_URL}/gemini-promptlari`,
  `${BASE_URL}/en-yeni-prompts`,
  `${BASE_URL}/one-cikanlar`,
  `${BASE_URL}/prompts`,
  `${BASE_URL}/konular`,
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
