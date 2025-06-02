'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '../_shared/Button';
import { OmamoriData } from '@/types/omamori';

type Props = {
  omamoriData: OmamoriData;
  onClose: () => void;
};

export default function OmamoriModal({ omamoriData, onClose }: Props) {
  return (
    <div className="flex flex-col gap-4 items-center min-w-[20rem]">
      <div className="w-full text-2xl font-bold text-left">{omamoriData.name}</div>
      <div className="w-full flex flex-row gap-4 justify-center">
        <div className="min-w-[8.75rem] max-w-[12.5rem] flex justify-center items-center">
          <Image src={omamoriData.imageUrl} alt={omamoriData.name} width={200} height={300} />
        </div>
        <div className="max-w-[20rem] flex flex-col justify-items-start items-center gap-2">
          <div className="w-full text-xl font-bold text-left">【基本説明】</div>
          <div className="w-full h-full text-sm text-left whitespace-pre-line">
            {omamoriData.description}
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row gap-4 justify-center">
        <div className="min-w-[8.75rem] max-w-[12.5rem] flex flex-col justify-items-start items-start gap-2">
          <div className="w-full text-xl font-bold text-left">【効能】</div>
          <div className="flex flex-col justify-items-start items-start gap-1">
            {omamoriData.effects.map((effect) => (
              <div key={effect.name}>
                <div className="text-sm">{effect.name + ' +' + effect.power}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-[20rem] flex flex-col justify-items-start items-center gap-2">
          <div className="w-full text-xl font-bold text-left">【効能説明】</div>
          <div className="w-full h-[14rem] text-sm text-left whitespace-pre-line overflow-y-auto scrollbar-hide">
            {omamoriData.additionalDescription}
          </div>
        </div>
      </div>
      <Button variant="negative" size="md" onClick={onClose}>
        やめる
      </Button>
    </div>
  );
}
