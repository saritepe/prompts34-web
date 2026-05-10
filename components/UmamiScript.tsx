'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

const EXCLUDED_PREFIXES = [
  '/giris',
  '/kayit',
  '/my-prompts',
  '/settings',
  '/auth',
];

export default function UmamiScript() {
  const pathname = usePathname();

  if (
    pathname &&
    EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  ) {
    return null;
  }

  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
      data-domains="prompts34.com"
      strategy="afterInteractive"
    />
  );
}
