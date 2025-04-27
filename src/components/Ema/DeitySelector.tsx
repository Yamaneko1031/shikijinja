// components/DeitySelector.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { EmaImageKey } from '@/types/ema';
import { emaList } from '@/config/ema';
import { Button } from '@/components/shared/Button';
interface DeitySelectorProps {
  onSelect: (key: EmaImageKey) => void;
  onCancel: () => void;
}

export default function DeitySelector({ onSelect, onCancel }: DeitySelectorProps) {
  return (
    <div className="flex flex-col gap-4 items-center bg-black/80 rounded-lg p-2 max-w-[400px] min-w-[320px] w-full shadow-xl relative text-white">
      <h2 className="text-xl font-bold mb-4">どの神様に願いを届けますか？</h2>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {Object.entries(emaList).map(([key, data]) => (
          <Button
            variant="custom"
            key={key}
            onClick={() => onSelect(key as EmaImageKey)}
            className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 text-left text-white"
          >
            <div className="w-[64px] h-[64px] rounded-md overflow-hidden shrink-0">
              <Image
                src={`/images/illust/${data.illustname}`}
                alt={data.label}
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col text-sm whitespace-pre-line">
              <div className="font-bold text-base">{data.label}</div>
              <div className="text-gray-300">{data.grace}</div>
            </div>
          </Button>
        ))}
      </div>
      <Button variant="negative" size="md" onClick={onCancel}>
        閉じる
      </Button>
    </div>
  );
}
