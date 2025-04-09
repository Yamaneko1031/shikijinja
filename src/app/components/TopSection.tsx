'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';

const TopSection = () => {
  const { scrollY } = useScroll();

  // 慣性付きスクロール位置
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 60, // 硬さ（小さいほど柔らかく）
    damping: 20, // 減衰（大きいほどブレーキが効く）
  });

  const toriiScale = useTransform(smoothScrollY, [0, 400], [1, 5.0]);
  const toriiOpacity = useTransform(smoothScrollY, [100, 500], [1, 0]);
  const titleOpacity = useTransform(scrollY, [50, 300], [1, 0]);

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
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
      <motion.h1
        style={{ opacity: titleOpacity }}
        className="absolute top-[40%] left-1/2 -translate-x-1/2 text-white text-4xl sm:text-6xl font-fude font-bold drop-shadow-[0_0_5px_rgba(0,0,0,1)] z-1000 pointer-events-none"
      >
        式岐神社
      </motion.h1>
    </section>
  );
};

export default TopSection;
