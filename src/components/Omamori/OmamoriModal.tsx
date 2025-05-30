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
    <div className="flex flex-col gap-4 items-center min-w-[320px]">
      <div className="w-full flex flex-row gap-4 justify-center">
        <div className="min-w-[140px] max-w-[200px] flex justify-center items-center">
          <Image src={omamoriData.imageUrl} alt={omamoriData.name} width={200} height={300} />
        </div>
        <div className="max-w-[320px] flex flex-col justify-items-start items-center gap-2">
          <div className="w-full text-2xl font-bold text-left">【{omamoriData.name}】</div>
          <div className="w-full h-full text-md text-left whitespace-pre-line">
            {omamoriData.description}
          </div>
          {omamoriData.effects.map((effect) => (
            <div key={effect.name}>
              <div className="text-sm">{effect.name + '+' + effect.power}</div>
            </div>
          ))}
        </div>
      </div>
      <Button variant="negative" size="md" onClick={onClose}>
        やめる
      </Button>
    </div>
  );
}
