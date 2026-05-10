import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/my-prompts', '/settings', '/auth/', '/giris', '/kayit'],
    },
    sitemap: 'https://prompts34.com/sitemap.xml',
  };
}
