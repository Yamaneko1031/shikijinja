'use client';

import React from 'react';
import TextReveal from '@/components/_shared/TextReveal';
import { getTokuCoin } from '@/utils/toku';
import { Button } from '../_shared/Button';
import Image from 'next/image';
import { SectionProps } from '@/types/section';

const NadenekoSection = (props: SectionProps) => {
  const handlePostWish = () => {
    props.handleTokuGet('nadeneko');
  };

  return (
    <>
      <div className="relative max-w-2xl min-w-[320px] top-[600px] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <div className="relative h-full w-full bg-black/50 rounded-lg flex flex-col gap-2 pt-4 pl-4 pb-4 pr-[180px]">
          <div className="">
            <TextReveal
              text="（じー・・・）"
              delayPerChar={0.1}
              className="text-xl md:text-2xl font-bold"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-[200px]">
            <Image
              src="/images/nadeneko/neko_nadeneko.webp"
              alt="neko_nadeneko"
              width={400}
              height={300}
            />
          </div>
        </div>
        <div className="relative h-full w-full bg-black/50 rounded-lg flex flex-row gap-2 p-4"></div>
        <Button
          variant="positive"
          size="lg"
          onClick={() => {
            handlePostWish();
          }}
          className="w-full max-w-md flex flex-col pt-2 pb-2"
        >
          <div className="text-xl font-bold">なでる</div>
          <div className="flex flex-row items-center">
            <Image src="/images/icon/icon_coin.webp" alt="omikuji_button" width={24} height={24} />
            <div className="text-sm text-yellow-400 font-bold">
              {getTokuCoin('nadeneko')}獲得（1日1回）
            </div>
          </div>
        </Button>
      </div>
    </>
  );
};

export default React.memo(NadenekoSection);
