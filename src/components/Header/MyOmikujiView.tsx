'use client';

import React, { useState } from 'react';
import { OmikujiResponse } from '@/types/omikuji';
import { Button } from '../_shared/Button';
import OmikujiSeat from '../Omikuji/OmikujiSeat';
import Image from 'next/image';
type Props = {
  omikujiResponses: OmikujiResponse[];
  onClose: () => void;
};

export default function MyOmikujiView({ omikujiResponses, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rate, setRate] = useState(1);
  let transformOrigin = `left top`;
  if (rate < 1) {
    transformOrigin = `center center`;
  }
  return (
    <div className="select-none">
      <div className="min-h-[100lvh] pl-10 pt-5 flex flex-col items-center">
        <div
          className="m-auto pr-10 pb-20 "
          style={{
            transform: `scale(${rate})`,
            transformOrigin: transformOrigin,
          }}
        >
          <OmikujiSeat omikujiResponse={omikujiResponses[currentIndex]} />
        </div>
      </div>
      <div className="fixed w-full bottom-6 m-auto flex flex-row justify-center gap-2">
        {/* 閉じるボタン */}

        <Button variant="negative" size="md" onClick={onClose} aria-label="閉じる">
          閉じる
        </Button>
        <Button
          variant="subNatural"
          size="md"
          onClick={() => setCurrentIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
          aria-label="前"
        >
          前
        </Button>
        <div className="w-12 text-md flex items-center justify-center drop-shadow-[1px_1px_1px_rgba(0,0,0,1)]">
          {currentIndex + 1} / {omikujiResponses.length}
        </div>
        <Button
          variant="subNatural"
          size="md"
          onClick={() => setCurrentIndex(currentIndex + 1)}
          disabled={currentIndex === omikujiResponses.length - 1}
          aria-label="次"
        >
          次
        </Button>
        <Button
          variant="subNatural"
          size="md"
          onClick={() => setRate(rate - 0.05)}
          aria-label="縮小"
          disabled={rate <= 0.75}
        >
          <Image src="/images/icon/icon_glass_minus.svg" alt="縮小" width={24} height={24} />
        </Button>
        <Button
          variant="subNatural"
          size="md"
          onClick={() => setRate(rate + 0.05)}
          aria-label="拡大"
          disabled={rate >= 1.25}
        >
          <Image src="/images/icon/icon_glass_plus.svg" alt="拡大" width={24} height={24} />
        </Button>
      </div>
    </div>
  );
}
