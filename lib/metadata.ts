const DEFAULT_DESCRIPTION_MAX_LENGTH = 155;

const HTML_ENTITIES: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"',
};

function decodeHtmlEntities(value: string): string {
  return value.replace(
    /&(#x[\da-f]+|#\d+|[a-z][\da-z]+);/gi,
    (entity, body) => {
      const normalized = body.toLowerCase();

      if (normalized.startsWith('#x')) {
        const codePoint = Number.parseInt(normalized.slice(2), 16);
        return Number.isFinite(codePoint)
          ? String.fromCodePoint(codePoint)
          : entity;
      }

      if (normalized.startsWith('#')) {
        const codePoint = Number.parseInt(normalized.slice(1), 10);
        return Number.isFinite(codePoint)
          ? String.fromCodePoint(codePoint)
          : entity;
      }

      return HTML_ENTITIES[normalized] ?? '';
    },
  );
}

function truncateAtWordBoundary(value: string, maxLen: number): string {
  if (value.length <= maxLen) {
    return value;
  }

  const ellipsis = '…';
  if (maxLen <= ellipsis.length) {
    return ellipsis.slice(0, maxLen);
  }

  const limit = Math.max(0, maxLen - ellipsis.length);
  const candidate = value.slice(0, limit).trimEnd();

  if (/\s/.test(value.charAt(limit))) {
    return `${candidate}${ellipsis}`;
  }

  const lastWhitespace = candidate.lastIndexOf(' ');
  const truncated =
    lastWhitespace > 0 ? candidate.slice(0, lastWhitespace).trimEnd() : '';

  return `${truncated}${ellipsis}`;
}

export function buildDescription(
  text: string | null | undefined,
  maxLen = DEFAULT_DESCRIPTION_MAX_LENGTH,
): string {
  const normalized = decodeHtmlEntities(text ?? '')
    .replace(/\s+/g, ' ')
    .trim();

  return truncateAtWordBoundary(normalized, maxLen);
}
