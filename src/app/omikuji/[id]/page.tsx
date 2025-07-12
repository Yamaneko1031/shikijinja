// app/omikuji/[id]/page.tsx
import type { Metadata } from 'next';
import { prisma } from '@/server/prisma';
import OmikujiClientPage from './OmikujiClientPage';
import { headers } from 'next/headers';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const headersList = await headers();

  const host = headersList.get('host') || headersList.get('x-forwarded-host') || 'shiki-jinja.jp';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const omikuji = await prisma.omikujiResult.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!omikuji) {
    return { title: 'おみくじが見つかりません - 式岐神社' };
  }

  const fortune = omikuji.fortune;

  return {
    title: '式岐神社 -shiki jinja-',
    description:
      'オンラインで参拝できる神社。IT業界で働く人にご利益があると言い伝えられている神社です。',
    openGraph: {
      title: `${fortune}`,
      description: '式岐神社でおみくじを引きました！',
      url: `${baseUrl}/omikuji/${id}`,
      siteName: '式岐神社',
      images: [
        {
          url: `${baseUrl}/api/og/omikuji?id=${id}`,
          width: 1200,
          height: 630,
          alt: 'おみくじ結果',
        },
      ],
      locale: 'ja_JP',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${fortune}`,
      description: '式岐神社でおみくじを引きました！',
    },
  };
}

export default function OmikujiPage({ params }: Props) {
  return <OmikujiClientPage params={params} />;
}
