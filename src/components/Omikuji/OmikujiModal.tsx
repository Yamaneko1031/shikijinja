'use client';

import React, { useState } from 'react';
import { OmikujiResponse } from '@/types/omikuji';
import { Button } from '../_shared/Button';
import OmikujiSeat from './OmikujiSeat';

type Props = {
  omikujiResponse: OmikujiResponse;
  onClose: () => void;
};

export default function OmikujiModal({ omikujiResponse, onClose }: Props) {
  const [rate, setRate] = useState(1);
  let transformOrigin = `left top`;
  if (rate < 1) {
    transformOrigin = `center center`;
  }
  return (
    <div className="select-none">
      <div className="min-h-[100lvh] pt-5 flex flex-col items-center">
        <div
          className="m-auto pb-20 "
          style={{
            transform: `scale(${rate})`,
            transformOrigin: transformOrigin,
          }}
        >
          <OmikujiSeat omikujiResponse={omikujiResponse} />
        </div>
      </div>
      <div className="fixed w-full bottom-6 m-auto flex flex-row justify-center gap-2">
        <Button variant="negative" size="md" onClick={onClose} aria-label="閉じる">
          閉じる
        </Button>
        <Button
          variant="subNatural"
          size="md"
          onClick={() => setRate(rate - 0.05)}
          aria-label="縮小"
          disabled={rate <= 0.75}
        >
          -
        </Button>
        <Button
          variant="subNatural"
          size="md"
          onClick={() => setRate(rate + 0.05)}
          aria-label="拡大"
          disabled={rate >= 1.25}
        >
          +
        </Button>
      </div>
    </div>
  );
}
