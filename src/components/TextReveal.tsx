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
  const ref = useRef(null);
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

  // 改行で分割（\n か 複数行文字列にも対応）
  const lines = text.split(/\r?\n/);

  return (
    <div ref={ref} className={className}>
      {lines.map((line, lineIndex) => (
        <div key={lineIndex} className="block">
          {line.split('').map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              custom={i + lineIndex * 100}
              initial="hidden"
              animate={controls}
              variants={variants}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </div>
      ))}
    </div>
  );
}
