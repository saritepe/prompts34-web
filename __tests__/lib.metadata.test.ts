import { describe, expect, it } from 'vitest';
import { buildDescription } from '@/lib/metadata';

describe('buildDescription', () => {
  it('decodes HTML entities and normalizes whitespace', () => {
    expect(
      buildDescription(
        'Bu prompt &quot;iPhone&quot; hissi verir&nbsp; ve   temizdir.',
      ),
    ).toBe('Bu prompt "iPhone" hissi verir ve temizdir.');
  });

  it('truncates at a word boundary and appends an ellipsis', () => {
    const description = buildDescription(
      'Birinci ikinci üçüncü dördüncü beşinci altıncı yedinci',
      32,
    );

    expect(description).toBe('Birinci ikinci üçüncü…');
    expect(description.length).toBeLessThanOrEqual(32);
  });

  it('does not leave a partial long word when no boundary fits', () => {
    expect(buildDescription('KesintisizÇokUzunBirKelime', 12)).toBe('…');
  });
});
