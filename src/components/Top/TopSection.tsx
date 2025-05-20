'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import TextReveal from '../_shared/TextReveal';
import ReafParticles from '../_shared/ReafParticles';
import { User } from '@/types/user';
import { TokuId } from '@/types/toku';

type Props = {
  isActive: boolean;
  isNeighbor: boolean;
  user: User;
  handleAddCoin: (coin: number) => void;
  handleIsLimitOver: (tokuId: TokuId) => boolean;
  handleTokuCountUp: (tokuId: TokuId) => void;
};

const TopSection = (props: Props) => {
  console.log('TopSection', props.isActive, props.isNeighbor);
  const { scrollY } = useScroll();

  const toriiScale = useTransform(scrollY, [0, 400], [1, 3.5]);
  const toriiOpacity = useTransform(scrollY, [100, 500], [1, 0]);
  const titleOpacity = useTransform(scrollY, [150, 400], [1, 0]);

  return (
    <div className="pointer-events-none">
      {/* 鳥居 */}
      {props.isActive && (
        <motion.div
          className="fixed z-30 pointer-events-none -translate-x-1/2 -translate-y-1/2 gpu-layer"
          style={{
            top: 'calc(50lvh)',
            left: '50%',
            scale: toriiScale,
            opacity: toriiOpacity,
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
      )}
      <motion.h1
        className="absolute left-1/2 translate-x-20 -translate-y-20 vertical text-shadow-3 z-30"
        style={{ top: '30lvh', opacity: titleOpacity }}
      >
        式岐神社
      </motion.h1>
      <motion.div
        className="absolute left-1/2 -translate-x-25 -translate-y-35 vertical text-shadow-2 z-30"
        style={{ top: '50lvh', opacity: titleOpacity }}
      >
        <TextReveal
          text={`IT業界に関わる\n全ての人に\nご利益をもたらすと\n言い伝えられている`}
          delayPerChar={0.1}
        />
      </motion.div>

      {/* 落ち葉 */}
      {props.isActive && <ReafParticles />}
    </div>
  );
};

export default React.memo(TopSection);
