'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import TextReveal from '../shared/TextReveal';

type Props = {
  isActive: boolean;
  isNeighbor: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TopSection = ({ isActive, isNeighbor }: Props) => {
  const { scrollY } = useScroll();

  const toriiScale = useTransform(scrollY, [0, 400], [1.2, 3.5]);
  const toriiOpacity = useTransform(scrollY, [100, 500], [1, 0]);
  const titleOpacity = useTransform(scrollY, [150, 400], [1, 0]);

  return (
    <>
      {/* 鳥居 */}
      <motion.div
        className="fixed z-30 pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{
          top: 'calc(50lvh)',
          left: '50%',
          scale: toriiScale,
          opacity: toriiOpacity,
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          height: 'calc(80vw * 1)',
          maxHeight: '80vh',
          transformOrigin: '50% 70%',
        }}
      >
        <Image
          src="/images/bg_hude/torii.webp"
          alt="式岐神社の鳥居"
          fill
          className="object-contain"
          priority
        />
      </motion.div>
      {/* <motion.div
        className="fixed inset-0 bg-black/70 z-20"
        style={{ opacity: useTransform(scrollY, [0, 300], [1, 0]) }}
      /> */}
      <motion.h1
        className="absolute left-1/2 translate-x-20 -translate-y-20 vertical text-shadow-3 z-30 pointer-events-none"
        style={{ top: '30lvh', opacity: titleOpacity }}
      >
        式岐神社
      </motion.h1>
      <motion.div
        className="absolute left-1/2 -translate-x-25 -translate-y-35 vertical text-shadow-2 z-30 pointer-events-none"
        style={{ top: '50lvh', opacity: titleOpacity }}
      >
        <TextReveal
          text={`IT業界に関わる\n全ての人に\nご利益をもたらすと\n言い伝えられている`}
          delayPerChar={0.1}
        />
      </motion.div>

      {/* 落ち葉 */}
      {isActive && (
        <div className="leaf">
          <ul>
            {Array.from({ length: 9 }).map((_, index) => (
              <li key={index}></li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default React.memo(TopSection);
