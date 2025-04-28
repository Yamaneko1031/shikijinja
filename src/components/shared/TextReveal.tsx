'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

type Props = {
  text: string;
  delayPerChar?: number;
  className?: string;
};

export default function TextReveal({ text, delayPerChar = 0.05, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const variants = {
    hidden: { opacity: 0, y: 4 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * delayPerChar,
        duration: 0.3,
      },
    }),
  };

  // 文字単位で split しつつ、改行は <br /> に置き換え
  const chars = text.split('').map((char, idx) =>
    char === '\n' ? (
      // 改行文字は <br/>
      <br key={`br-${idx}`} />
    ) : (
      <motion.span
        key={idx}
        custom={idx}
        initial="hidden"
        animate={controls}
        variants={variants}
        className="inline-block"
      >
        {/* 半角スペースは &nbsp; に */}
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    )
  );

  return (
    <div
      ref={ref}
      className={className}
      style={{ whiteSpace: 'pre-wrap' }} // 改行とスペースを反映
    >
      {chars}
    </div>
  );
}
