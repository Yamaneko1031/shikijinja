'use client';

import React from 'react';
import Image from 'next/image';
import { OmamoriDataResponse } from '@/types/omamori';

type Props = {
  omamoriData: OmamoriDataResponse;
};

export default function OmamoriSeat({ omamoriData }: Props) {
  return (
    <div className="relative w-[25rem] min-w-[25rem] p-6 text-black flex flex-col gap-4 bg-[url('/images/bg_hude/bg_washi2.webp')] bg-[length:100%_100%]">
      <div className="w-full text-xl font-bold text-center mb-2">～お守り鑑定書～</div>
      <div className="w-full text-2xl font-bold text-left">
        {omamoriData.name}（{omamoriData.hurigana}）
      </div>
      <div className="w-full flex flex-row gap-4 justify-center">
        <div className="min-w-[8.75rem] max-w-[12.5rem] flex justify-center items-center">
          <Image src={omamoriData.imageUrl} alt={omamoriData.name} width={200} height={300} />
        </div>
        <div className="max-w-[20rem] flex flex-col justify-items-start items-center gap-2">
          <div className="w-full text-md font-bold text-left text-underline">基本説明</div>
          <div className="w-full h-full text-sm text-left whitespace-pre-line">
            {omamoriData.description}
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row gap-4 justify-center">
        <div className="min-w-[8.75rem] max-w-[12.5rem] flex flex-col justify-items-start items-start gap-2">
          <div className="w-full text-md font-bold text-left text-underline">効能</div>
          <div className="flex flex-col justify-items-start items-start gap-1">
            {omamoriData.effects.map((effect) => (
              <div key={effect.name}>
                <div className="text-sm">{effect.name + ' +' + effect.power}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-[20rem] flex flex-col justify-items-start items-center gap-2">
          <div className="w-full text-md font-bold text-left text-underline">効能説明</div>
          <div className="w-full text-sm text-left whitespace-pre-line">
            {omamoriData.additionalDescription}
          </div>
        </div>
      </div>
    </div>
  );
}
