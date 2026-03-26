import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { SOCIAL_IMAGE_PATH } from '@/app/shared-metadata';
import { readPngDimensions } from './test-utils/png';

describe('og image asset', () => {
  const ogImagePath = path.join(
    process.cwd(),
    'public',
    SOCIAL_IMAGE_PATH.replace(/^\//, ''),
  );

  it('keeps the canonical public path', () => {
    expect(SOCIAL_IMAGE_PATH).toBe('/og-image.png');
    expect(existsSync(ogImagePath)).toBe(true);
  });

  it('is a valid 1200x630 png', () => {
    const image = readFileSync(ogImagePath);

    expect(readPngDimensions(image)).toEqual({
      width: 1200,
      height: 630,
    });
  });
});
