'use client';

import React from 'react';
import Image from 'next/image';
import { OmamoriDataResponse } from '@/types/omamori';

type Props = {
  omamoriData: OmamoriDataResponse;
};

export default function OmamoriSeat({ omamoriData }: Props) {
  return (
    <div className="relative w-[25rem] h-[42rem] text-black flex flex-col bg-[url('/images/bg_hude/bg_kanteisho.webp')] bg-[length:100%_100%]">
      <div className="absolute top-7 w-full text-md font-bold text-center mb-2">
        - お守り鑑定書 -
      </div>
      {/* お守り名 */}
      <div className="absolute top-19 left-8 text-2xl font-bold text-left">
        {omamoriData.name}（{omamoriData.hurigana}）
      </div>
      {/* お守り画像 */}
      <div className="absolute w-[8.5rem] top-30 left-7 flex justify-center items-center rotate-[14deg]">
        <Image src={omamoriData.imageUrl} alt={omamoriData.name} width={200} height={300} />
      </div>
      {/* 基本説明 */}
      <div className="absolute w-[12.5rem] top-32 left-44 flex flex-col justify-start items-start gap-2">
        <div className="text-md font-bold text-left">基本説明</div>
        <div className="w-full h-[11rem] text-sm text-left whitespace-pre-line overflow-y-auto">
          {omamoriData.description}
        </div>
      </div>
      {/* 効能 */}
      <div className="absolute w-[8rem] top-88 left-8 flex flex-col justify-start items-start gap-2">
        <div className="text-md font-bold text-left">効能</div>
        <div className="w-full h-[16.5rem] flex flex-col justify-items-start items-start gap-1 overflow-y-auto">
          {omamoriData.effects.map((effect) => (
            <div key={effect.name}>
              <div className="text-sm">{effect.name + ' +' + effect.power}</div>
            </div>
          ))}
        </div>
      </div>
      {/* 効能説明 */}
      <div className="absolute w-[12.5rem] top-88 left-44 flex flex-col justify-start items-start gap-2">
        <div className="text-md font-bold text-left">効能説明</div>
        <div className="w-full h-[16.5rem] text-sm text-left whitespace-pre-line overflow-y-auto">
          {omamoriData.additionalDescription}
        </div>
      </div>
    </div>
  );
}
