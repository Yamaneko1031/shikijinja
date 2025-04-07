'use client';

import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import FadeInSection from './components/FadeInSection';

export default function Home() {
  const { scrollY } = useScroll();

  const bg1Opacity = useTransform(scrollY, [250, 800], [1, 0]);
  const bg2Opacity = useTransform(scrollY, [250, 800], [1, 1]);

  const toriiScale = useTransform(scrollY, [0, 500], [1, 4.0]);
  const toriiOpacity = useTransform(scrollY, [100, 500], [1, 0]);
  const titleOpacity = useTransform(scrollY, [50, 300], [1, 0]);

  const [message, setMessage] = useState('まだお告げはありません');
  const [loading, setLoading] = useState(false);

  const fetchOmikuji = async () => {
    setLoading(true);
    setMessage('神様と交信中…⛩️');

    try {
      const res = await fetch('/api/omikuji', { method: 'POST' });
      const data = await res.json();
      setMessage(data.result);
    } catch (err) {
      setMessage('お告げの取得に失敗しました…🐾');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative w-full overflow-hidden">
      {/* 背景画像：固定 + クロスフェード + イベント無視 */}
      {/* 背景A */}
      <motion.div
        style={{
          opacity: bg1Opacity,
          height: '100lvh',
          transform: 'translateZ(0.01px)',
        }}
        className="fixed top-0 left-0 w-full pointer-events-none z-100"
      >
        <Image src="/images/bg.webp" alt="背景A" fill className="object-cover" priority />
      </motion.div>

      {/* 背景B */}
      <motion.div
        style={{
          opacity: bg2Opacity,
          height: '100lvh',
          transform: 'translateZ(0.01px)',
        }}
        className="fixed top-0 left-0 w-full pointer-events-none z-90"
      >
        <Image src="/images/sando.webp" alt="背景B" fill className="object-cover" priority />
      </motion.div>

      {/* 通常のコンテンツセクション群 */}
      <section className="relative w-full min-h-screen z-101">
        <motion.div
          className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            scale: toriiScale,
            opacity: toriiOpacity,
            width: '65vw',
            height: 'calc(65vw * 1)',
          }}
        >
          <Image src="/images/torii.webp" alt="式岐神社の鳥居" fill className="object-contain" />
        </motion.div>

        <motion.h1
          style={{ opacity: titleOpacity }}
          className="absolute top-[40%] left-1/2 -translate-x-1/2 text-white text-4xl sm:text-6xl font-fude font-bold drop-shadow-[0_0_5px_rgba(0,0,0,1)] z-1000 pointer-events-none"
        >
          式岐神社
        </motion.h1>
      </section>

      <FadeInSection>
        <h2 className="text-2xl sm:text-4xl font-semibold">ようこそ式岐神社へ</h2>
      </FadeInSection>

      <FadeInSection>
        <h2 className="text-2xl sm:text-4xl font-semibold">心得</h2>
      </FadeInSection>

      <FadeInSection>
        <h2 className="text-2xl sm:text-4xl font-semibold">絵馬</h2>
      </FadeInSection>

      <FadeInSection>
        <h2 className="text-2xl sm:text-4xl font-semibold">御守り</h2>
      </FadeInSection>

      <FadeInSection>
        <h2 className="text-2xl sm:text-4xl font-semibold">撫で猫</h2>
      </FadeInSection>

      <FadeInSection>
        <h2 className="text-2xl sm:text-4xl font-semibold">
          <button
            onClick={fetchOmikuji}
            className={`px-4 py-2 rounded ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
            disabled={loading}
          >
            {loading ? 'おみくじ引き中…' : 'おみくじを引く'}
          </button>
          <p className="mt-6 text-center">{message}</p>
        </h2>
      </FadeInSection>

      <FadeInSection>
        <h2 className="text-2xl sm:text-4xl font-semibold">神様紹介</h2>
      </FadeInSection>

      <FadeInSection>
        <h2 className="text-2xl sm:text-4xl font-semibold">拝殿</h2>
      </FadeInSection>
    </main>
  );
}
