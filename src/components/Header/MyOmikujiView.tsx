'use client';

import React, { useState } from 'react';
import { OmikujiResponse } from '@/types/omikuji';
import { Button } from '../_shared/Button';
import OmikujiSeat from '../Omikuji/OmikujiSeat';

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
    <>
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
        <div className="">
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
          onClick={() => setRate(rate + 0.05)}
          aria-label="拡大"
        >
          拡大
        </Button>
        <Button
          variant="subNatural"
          size="md"
          onClick={() => setRate(rate - 0.05)}
          aria-label="縮小"
        >
          縮小
        </Button>
      </div>
    </>
  );
}
