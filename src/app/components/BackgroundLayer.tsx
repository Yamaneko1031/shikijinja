'use client';

import { motion, MotionValue } from 'framer-motion';
import Image from 'next/image';

type BackgroundLayerProps = {
  src: string;
  opacity: MotionValue<number>;
  zIndex: number;
  objectPosition?: string; // 例: '35% center'
  priority?: boolean; // ← 追加
};

export default function BackgroundLayer({
  src,
  opacity,
  zIndex,
  objectPosition = '50% center', // デフォルトは中央
  priority = false,
}: BackgroundLayerProps) {
  return (
    <motion.div
      style={{
        opacity,
        height: '100lvh',
        transform: 'translateZ(0.01px)',
        zIndex,
      }}
      className={`fixed top-0 left-0 w-full pointer-events-none`}
    >
      <Image
        src={src}
        alt=""
        fill
        className="object-cover"
        style={{ objectPosition }}
        priority={priority}
      />
    </motion.div>
  );
}
