'use client';

import { useState } from 'react';

interface CopyContentButtonProps {
  content: string;
}

export default function CopyContentButton({ content }: CopyContentButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      console.error('İçerik kopyalanamadı', error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
      aria-label="İçeriği kopyala"
      title={copied ? 'Kopyalandı' : 'Kopyala'}
    >
      {copied ? '✓' : '⧉'}
    </button>
  );
}
