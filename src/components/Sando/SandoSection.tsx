'use client';

import React from 'react';
// import TextReveal from '@/components/_shared/TextReveal';
import { SectionProps } from '@/types/section';
import { Button } from '../_shared/Button';

const SandoSection = (props: SectionProps) => {
  console.log('SandoSection', props.isActive, props.isNeighbor);
  const handlePostWish = () => {
    alert(`参拝マナーを見ました`);
  };

  return (
    <>
      <div className="relative max-w-2xl min-w-[320px] top-[800px] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        {/* <div className="relative h-full w-full bg-black/50 rounded-lg flex flex-col gap-2 pt-4 pl-4 pb-4 pr-[180px]">
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
        </div> */}
        <div className="relative h-full w-full bg-black/50 rounded-lg flex flex-row p-8">
          <div className="text-2xl flex flex-col gap-20">
            <p>デジタルの海に浮かぶ祈りの社。</p>
            <p>IT業界にゆかり深き神々が祭られている、現代人のための神社です。</p>
            <p>エンジニアの神、デザイナーの神、ディレクターの神。</p>
            <p>
              技と知恵を授ける三柱の神が、それぞれの道を歩む者の背中を静かに押してくれるでしょう。
            </p>
            <p>今日も、どうか良きご縁とひらめきがありますように。</p>
          </div>
        </div>
        <Button
          variant="positive"
          size="lg"
          onClick={() => {
            handlePostWish();
          }}
          className="w-full max-w-md flex flex-col pt-2 pb-2"
        >
          <div className="text-xl font-bold">参拝マナーを見る</div>
          {/* <div className="flex flex-row items-center">
            <Image src="/images/icon/icon_coin.webp" alt="omikuji_button" width={24} height={24} />
            <div className="text-sm font-bold">{getTokuCoin('nadeneko')}獲得（1日1回）</div>
          </div> */}
        </Button>
      </div>
    </>
  );
};

export default React.memo(SandoSection);
