'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function FadeInSection({ children }: { children: ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
      className="relative z-30 w-full text-white text-center py-120"
    >
      {children}
    </motion.section>
  );
}
