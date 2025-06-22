// components/DeitySelector.tsx
'use client';

import React from 'react';
import { EmaImageKey } from '@/types/ema';
import { emaList } from '@/config/ema';
import { Button } from '@/components/_shared/Button';
interface DeitySelectorProps {
  onSelect: (key: EmaImageKey) => void;
  onCancel: () => void;
}

export default function DeitySelector({ onSelect, onCancel }: DeitySelectorProps) {
  return (
    <div className="flex flex-col gap-4 items-center min-w-[20rem]">
      <h2 className="text-xl font-bold">どの神様に願いを届けますか？</h2>
      <div className="w-full flex flex-col gap-2">
        {Object.entries(emaList).map(([key, data]) => (
          <Button
            variant="custom"
            key={key}
            onClick={() => onSelect(key as EmaImageKey)}
            className="flex justify-center items-center gap-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-left text-white"
          >
            <div
              className="w-[4rem] h-[4rem] flex justify-center items-center rounded-md overflow-hidden shrink-0"
              style={{
                backgroundImage: `url(/images/illust/${data.illustname})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            ></div>
            <div className="w-full flex flex-col text-sm whitespace-pre-line">
              <div className="font-bold text-base">{data.label}</div>
              <div className="text-gray-300">{data.grace}</div>
            </div>
          </Button>
        ))}
      </div>
      <Button variant="negative" size="md" onClick={onCancel}>
        やめる
      </Button>
    </div>
  );
}
