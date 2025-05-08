// components/OmikujiSelector.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/shared/Button';
import { OmikujiKey } from '@/types/omikuji';
import { omikujiList } from '@/config/omikuji';

interface OmikujiSelectorProps {
  onSelect: (key: OmikujiKey) => void;
  onCancel: () => void;
}

export default function OmikujiSelector({ onSelect, onCancel }: OmikujiSelectorProps) {
  return (
    <div className="flex flex-col gap-4 items-center min-w-[320px]">
      <h2 className="text-xl font-bold">どのおみくじを引きますか？</h2>
      <div className="flex flex-col gap-4">
        {Object.entries(omikujiList).map(([key, data]) => (
          <Button
            variant="custom"
            key={key}
            onClick={() => onSelect(key as OmikujiKey)}
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
        やめる
      </Button>
    </div>
  );
}
