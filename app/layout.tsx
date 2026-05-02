import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import Footer from '@/components/Footer';
import { WebSiteStructuredData } from './components/StructuredData';
import { sharedOpenGraphImage, sharedTwitterImage } from './shared-metadata';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://prompts34.com'),
  title: {
    default:
      'Prompts34 | Hazır Promptlar - Türkçe Yapay Zeka Prompt Kütüphanesi',
    template: '%s | Prompts34',
  },
  description:
    "Türkiye'nin en kapsamlı hazır prompt kütüphanesi. ChatGPT, Claude, Gemini ve diğer yapay zeka araçları için Türkçe promptlar. CV hazırlama, motivasyon mektubu, mülakat hazırlığı, görsel oluşturma ve daha fazlası.",
  keywords: [
    'hazır promptlar',
    'prompt kütüphanesi',
    'türkçe promptlar',
    'yapay zeka promptları',
    'chatgpt promptları',
    'chatgpt türkçe',
    'gemini promptları',
    'claude promptları',
    'ai prompts',
    'cv hazırlama',
    'motivasyon mektubu',
    'mülakat hazırlığı',
    'yapay zeka soru sor',
    'ücretsiz prompt',
    'prompt ne demek',
    'prompt mühendisliği',
    'turkish ai prompts',
  ],
  authors: [{ name: 'Prompts34' }],
  creator: 'Prompts34',
  publisher: 'Prompts34',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://prompts34.com',
    siteName: 'Prompts34',
    title: 'Prompts34 | Hazır Promptlar - Türkçe Yapay Zeka Prompt Kütüphanesi',
    description:
      "Türkiye'nin en kapsamlı hazır prompt kütüphanesi. ChatGPT, Claude, Gemini ve diğer yapay zeka araçları için Türkçe promptlar.",
    ...sharedOpenGraphImage,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prompts34 | Hazır Promptlar - Türkçe Prompt Kütüphanesi',
    description:
      "Türkiye'nin en kapsamlı hazır prompt kütüphanesi. ChatGPT, Claude, Gemini ve diğer yapay zeka araçları için Türkçe promptlar.",
    ...sharedTwitterImage,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://prompts34.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <WebSiteStructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          {children}
          <Footer />
        </AuthProvider>
        <Analytics />
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
