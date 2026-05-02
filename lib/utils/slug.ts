const TURKISH_MAP: Record<string, string> = {
  ğ: 'g',
  ü: 'u',
  ş: 's',
  ı: 'i',
  ö: 'o',
  ç: 'c',
};

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[ğüşıöç]/g, (c) => TURKISH_MAP[c] ?? c)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

export function getPromptPath(prompt: { id: string; title: string }): string {
  return `/prompts/${prompt.id}-${slugifyTitle(prompt.title)}`;
}
