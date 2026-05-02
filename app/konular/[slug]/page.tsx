import { permanentRedirect } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function KonularSlugRedirect({ params }: Props) {
  const { slug } = await params;
  permanentRedirect(`/kategori/${slug}`);
}
