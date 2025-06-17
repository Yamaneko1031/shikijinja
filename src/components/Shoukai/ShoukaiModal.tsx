'use client';

import React, { useState } from 'react';
import { Button } from '../_shared/Button';
import ShoukaiSeat from './ShoukaiSeat';
import { shoukaiTypeTable } from '@/config/shoukai';

type Props = {
  shoukaiIndex: number;
  onClose: () => void;
};

export default function ShoukaiModal({ shoukaiIndex, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(shoukaiIndex);

  return (
    <div className="select-none">
      <div className="min-h-[100lvh] pt-5 flex flex-col items-center">
        <div className="pl-4 pr-4 pt-5 pb-20 w-full max-w-[30rem]">
          <ShoukaiSeat shoukaiIndex={currentIndex} />
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
          {currentIndex + 1} / {shoukaiTypeTable.length}
        </div>
        <Button
          variant="subNatural"
          size="md"
          onClick={() => setCurrentIndex(currentIndex + 1)}
          disabled={currentIndex === shoukaiTypeTable.length - 1}
          aria-label="次"
        >
          次
        </Button>
      </div>
    </div>
  );
}
