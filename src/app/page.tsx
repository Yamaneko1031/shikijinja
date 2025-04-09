'use client';

import { useState } from 'react';
import { useScroll, useTransform, useSpring, motion } from 'framer-motion';
import Image from 'next/image';
import FadeInSection from './components/FadeInSection';
import BackgroundLayer from './components/BackgroundLayer';

export default function Home() {
  const { scrollY } = useScroll();

  // 慣性付きスクロール位置
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 60, // 硬さ（小さいほど柔らかく）
    damping: 20, // 減衰（大きいほどブレーキが効く）
  });

  const bgTopOpacity = useTransform(smoothScrollY, [250, 800], [1, 0]);
  const bgSandoOpacity = useTransform(smoothScrollY, [2250, 2800], [1, 0]);
  const bgEmaOpacity = useTransform(smoothScrollY, [3250, 3800], [1, 0]);
  const bgOmamoriOpacity = useTransform(smoothScrollY, [5250, 5800], [1, 0]);
  const bgOmikujiOpacity = useTransform(smoothScrollY, [6250, 6800], [1, 1]);

  const toriiScale = useTransform(smoothScrollY, [0, 500], [1, 4.0]);
  const toriiOpacity = useTransform(smoothScrollY, [100, 500], [1, 0]);
  const titleOpacity = useTransform(smoothScrollY, [50, 300], [1, 0]);

  const [message, setMessage] = useState('まだお告げはありません');
  const [loading, setLoading] = useState(false);

  const backgroundLayers = [
    {
      src: '/images/bg_top.webp',
      opacity: bgTopOpacity,
      zIndex: 100,
    },
    {
      src: '/images/bg_sando.webp',
      opacity: bgSandoOpacity,
      zIndex: 90,
    },
    {
      src: '/images/bg_ema.webp',
      opacity: bgEmaOpacity,
      zIndex: 80,
      objectPosition: '40% center',
    },
    {
      src: '/images/bg_omamori.webp',
      opacity: bgOmamoriOpacity,
      zIndex: 70,
      objectPosition: '35% center',
    },
    {
      src: '/images/bg_omikuji.webp',
      opacity: bgOmikujiOpacity,
      zIndex: 60,
      objectPosition: '35% center',
    },
  ];

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
      {/* 背景画像 */}
      {backgroundLayers.map((layer, index) => (
        <BackgroundLayer
          key={index}
          src={layer.src}
          opacity={layer.opacity}
          zIndex={layer.zIndex}
          objectPosition={layer.objectPosition}
        />
      ))}

      {/* 鳥居 */}
      <motion.div
        className="fixed z-100 pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{
          top: 'calc(50lvh)', // ← 明示的に高さを使う
          left: '50%',
          scale: toriiScale,
          opacity: toriiOpacity,
          transform: 'translate(-50%, -50%)',
          width: '75vw',
          height: 'calc(75vw * 1)',
          transformOrigin: '50% 70%', // ← 拡大の基準を中心にする
        }}
      >
        <Image
          src="/images/torii.webp"
          alt="式岐神社の鳥居"
          fill
          className="object-contain"
          priority
        />
      </motion.div>

      {/* 通常のコンテンツセクション群 */}
      <section className="relative w-full min-h-screen z-101">
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
