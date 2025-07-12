import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { DebugLogProvider } from '@/hooks/useDebugLog';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: '式岐神社 -shiki jinja-',
  description:
    'オンラインで参拝できる神社。IT業界で働く人にご利益があると言い伝えられている神社です。',
  openGraph: {
    title: '式岐神社 -shiki jinja-',
    description:
      'オンラインで参拝できる神社。IT業界で働く人にご利益があると言い伝えられている神社です。',
    url: 'https://shiki-jinja.jp',
    siteName: '式岐神社',
    images: [
      {
        url: 'https://shiki-jinja.jp/images/og/bg_default.jpg', // サムネイル画像
        width: 1200,
        height: 630,
        alt: '式岐神社のサムネイル画像',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '式岐神社 - IT業界にご利益を',
    description: 'オンラインで参拝できる神社',
    images: ['https://shiki-jinja.jp/images/og/bg_default.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="font-default antialiased">
        <DebugLogProvider>{children}</DebugLogProvider>
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
