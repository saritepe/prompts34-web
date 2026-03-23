import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import Footer from '@/components/Footer';
import { WebSiteStructuredData } from './components/StructuredData';
import { Analytics } from '@vercel/analytics/react';

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
      'Prompts34 | Yapay Zeka Promptları - ChatGPT, Claude, AI Prompt Kütüphanesi',
    template: '%s | Prompts34',
  },
  description:
    "Türkiye'nin en kapsamlı yapay zeka prompt kütüphanesi. ChatGPT, Claude ve diğer AI araçları için hazır promptlar. CV hazırlama, motivasyon mektubu, mülakat hazırlığı ve daha fazlası.",
  keywords: [
    'prompts34',
    'yapay zeka promptları',
    'chatgpt promptları',
    'ai prompts',
    'claude prompts',
    'cv hazırlama',
    'motivasyon mektubu',
    'mülakat hazırlığı',
    'yapay zeka',
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
    title:
      'Prompts34 | Yapay Zeka Promptları - ChatGPT, Claude, AI Prompt Kütüphanesi',
    description:
      "Türkiye'nin en kapsamlı yapay zeka prompt kütüphanesi. ChatGPT, Claude ve diğer AI araçları için hazır promptlar.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Prompts34 - Yapay Zeka Promptları',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prompts34 | Yapay Zeka Promptları',
    description:
      "Türkiye'nin en kapsamlı yapay zeka prompt kütüphanesi. ChatGPT, Claude ve diğer AI araçları için hazır promptlar.",
    images: ['/og-image.png'],
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
      </body>
    </html>
  );
}
