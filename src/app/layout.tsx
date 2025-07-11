import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { DebugLogProvider } from '@/hooks/useDebugLog';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: '式岐神社',
  description:
    '式岐神社 -shiki jinja- オンラインで参拝できる神社。IT業界で働く人にご利益があると言い伝えられている神社です。',
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
