import { describe, expect, it } from 'vitest';
import { GET as redirectCv } from '@/app/cv-hazirlama/route';
import { GET as redirectGorsel } from '@/app/gorsel-olusturma/route';
import { GET as redirectLogo } from '@/app/logo-olusturma/route';
import { GET as redirectMotivasyon } from '@/app/motivasyon-mektubu/route';
import { GET as redirectMulakat } from '@/app/mulakat-hazirligi/route';

const redirects = [
  {
    name: '/cv-hazirlama',
    handler: redirectCv,
    location: 'https://prompts34.com/kategori/cv-hazirlama',
  },
  {
    name: '/motivasyon-mektubu',
    handler: redirectMotivasyon,
    location: 'https://prompts34.com/kategori/motivasyon-mektubu',
  },
  {
    name: '/mulakat-hazirligi',
    handler: redirectMulakat,
    location: 'https://prompts34.com/kategori/mulakat-hazirligi',
  },
  {
    name: '/gorsel-olusturma',
    handler: redirectGorsel,
    location: 'https://prompts34.com/kategori/gorsel-olusturma',
  },
  {
    name: '/logo-olusturma',
    handler: redirectLogo,
    location: 'https://prompts34.com/kategori/logo-olusturma',
  },
];

describe('legacy topic redirects', () => {
  it.each(redirects)(
    'redirects $name with exactly one 301 target',
    ({ handler, location }) => {
      const response = handler();

      expect(response.status).toBe(301);
      expect(response.headers.get('location')).toBe(location);
    },
  );
});
