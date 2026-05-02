import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.redirect(
    'https://prompts34.com/kategori/motivasyon-mektubu',
    301,
  );
}
