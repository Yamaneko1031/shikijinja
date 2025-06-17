'use client';

import React from 'react';
// import Image from 'next/image';
import { shoukaiTypeTable } from '@/config/shoukai';

type Props = {
  shoukaiIndex: number;
};

export default function ShoukaiSeat({ shoukaiIndex }: Props) {
  const shoukaiData = shoukaiTypeTable[shoukaiIndex];
  return (
    <div className="relative w-full flex flex-col p-4 bg-white rounded-md text-black">
      <div
        className="relative w-full aspect-square flex flex-col bg-[length:100%_100%]"
        style={{
          backgroundImage: `url('/images/illust/${shoukaiData.illustname}')`,
        }}
      ></div>
      <div className="w-full font-bold text-left mb-2">{shoukaiData.name}</div>
      <div className="w-full text-sm text-left mb-2 whitespace-pre-line">{shoukaiData.text}</div>
    </div>
  );
}
