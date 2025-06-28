'use client';

import React, { useEffect, useState } from 'react';
import { OmamoriLoadingState } from '@/types/omamori';

type OmamoriShuffleProps = {
  stopNumber: number | null;
  loadingState: OmamoriLoadingState;
};

export default function OmamoriShuffle({ stopNumber, loadingState }: OmamoriShuffleProps) {
  const [position, setPosition] = useState<number | null>(null);
  const [isStop, setIsStop] = useState(false);

  const width = 8;
  const containerClass = `w-[8rem] h-[12rem] ${isStop ? 'animate-omamori-shuffle-stop' : ''}`;
  const bgPosition = `-${width * (position ?? 0)}rem 0rem`;

  useEffect(() => {
    if (loadingState === 'shuffle') {
      const interval = setInterval(() => {
        setPosition((prevPosition) => {
          const newPosition = Math.floor(Math.random() * 10);
          return newPosition === prevPosition ? (newPosition + 1) % 10 : newPosition;
        });
      }, 100);
      return () => clearInterval(interval);
    } else if (loadingState === 'stop' && stopNumber !== null) {
      setPosition(stopNumber);
      setIsStop(true);
    } else if (loadingState === 'fortune') {
      setPosition(null);
    }
  }, [stopNumber, loadingState]);

  return (
    position !== null && (
      <div
        className={containerClass}
        style={{
          backgroundImage: 'url("/images/omamori/omamori_all.webp")',
          backgroundPosition: bgPosition,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'auto 100%',
        }}
      ></div>
    )
  );
}
