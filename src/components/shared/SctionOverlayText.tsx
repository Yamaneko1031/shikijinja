import { getCssDuration } from '@/utils/getCssDuration';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  text: string;
};

const SectionOverlayText = ({ text }: Props) => {
  const [overlayText, setOverlayText] = useState<string | null>(null);
  const overlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (overlayTimerRef.current) {
      clearTimeout(overlayTimerRef.current);
      setOverlayText(null);
    }

    requestAnimationFrame(() => {
      setOverlayText(text);
      const sectionOverlayFadeDuration = getCssDuration('--section-overlay-fade-duration');
      overlayTimerRef.current = setTimeout(() => {
        setOverlayText(null);
        overlayTimerRef.current = null;
      }, sectionOverlayFadeDuration);
    });
  }, [text]);

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center pointer-events-none ${
        overlayText ? 'animate-section-overlay-fade' : ''
      }`}
      style={{ transform: 'translateZ(0.01px)', height: '100lvh' }}
    >
      <h2 className="absolute top-2/5 text-white text-4xl font-bold">{overlayText}</h2>
    </div>
  );
};

export default SectionOverlayText;
