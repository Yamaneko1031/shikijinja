'use client';

import React from 'react';
import { NadenekoResponse } from '@/types/nadeneko';
import Image from 'next/image';
import { nadenekoRank } from '@/config/nadeneko';

type Props = {
  lotData: NadenekoResponse;
};

export default function NadenekoResult({ lotData }: Props) {
  const rank =
    nadenekoRank.find((rank) => rank.coin > lotData.totalAddCoin) ??
    nadenekoRank[nadenekoRank.length - 1];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center animate-nadeneko-result">
      <div
        className={
          'absolute min-w-[30rem] aspect-square bg-[url("/images/nadeneko/nadeneko_result.webp")] bg-[length:100%_auto] bg-no-repeat rounded-md border-4 border-[rgba(40,20,0,0.5)]'
        }
      >
        <div className="absolute top-25 left-1/2 -translate-x-1/2 text-orange-200 font-bold text-6xl text-shadow-huchi2">
          結果
        </div>

        <div className="absolute w-75 top-45 left-10 text-white font-bold flex items-end justify-between text-shadow-huchi2">
          <div className="w-20 text-2xl text-orange-200">総なで</div>
          <div className="w-25 text-end text-5xl">{lotData.addCoins.length}</div>
          <div className="w-20 text-2xl text-orange-200">回</div>
        </div>

        <div className="absolute w-75 top-60 left-10 text-white font-bold flex items-end justify-between text-shadow-huchi2">
          <div className="w-20 text-2xl text-orange-200">総獲得</div>
          <div className="w-25 text-end text-5xl">{lotData.totalAddCoin}</div>
          <div className="w-20 text-2xl text-orange-200">
            徳
            {/* <div className="-ml-1 bg-[url('/images/icon/icon_coin.webp')] bg-[length:100%_auto] bg-no-repeat w-8 h-8"></div> */}
          </div>
        </div>

        <div className="absolute w-[18rem] top-80 left-5 animate-nadeneko-rank">
          <Image
            src="/images/nadeneko/nadeneko_rank.webp"
            alt="nadeneko_rank"
            width={600}
            height={600}
          />
          <div className="absolute top-10 w-full text-center text-white text-shadow-huchi2">
            {rank.name}
          </div>
          <div className="absolute top-16 w-full text-center text-[0.6rem] text-white text-shadow-huchi2">
            （{rank.description}）
          </div>
        </div>
      </div>
    </div>
  );
}
