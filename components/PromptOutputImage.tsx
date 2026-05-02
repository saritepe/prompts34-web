'use client';

import { useState } from 'react';

type PromptOutputImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function PromptOutputImage({
  src,
  alt,
  className,
}: PromptOutputImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-zinc-100 px-4 py-6 text-center text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400 ${className ?? ''}`}
      >
        <span>Görsel yüklenemedi</span>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs underline underline-offset-2"
        >
          Bağlantıyı yeni sekmede aç
        </a>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
