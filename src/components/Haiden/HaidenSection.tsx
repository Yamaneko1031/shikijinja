'use client';

import React, { useRef, useState } from 'react';
import TextReveal from '@/components/_shared/TextReveal';
import { SectionProps } from '@/types/section';
import { Button } from '../_shared/Button';
import { TokuId } from '@/types/toku';
import { useLoadImages } from '@/hooks/useLoadImages';
import { apiFetch } from '@/lib/api';
import { SaisenResponse } from '@/types/saisen';
const HaidenSection = (props: SectionProps) => {
  const [isThrowing, setIsThrowing] = useState(false);
  const sisenValue = useRef(0);
  const sisenValueTextSize = useRef('');
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);
  const loadedImages = useLoadImages(props.isActive || props.isNeighbor, [
    '/images/icon/icon_coin_nadeneko.webp',
  ]);
  loadedImagesRef.current = loadedImages;

  const throwCoin = async (value: number) => {
    setIsThrowing(true);

    const saisenPromise = apiFetch<SaisenResponse>('/api/saisen', {
      method: 'POST',
      body: JSON.stringify({ value }),
    });

    // // エフェクト演出を開始
    // const effectPromise = (async () => {
    //   for (const fortune of omamoriDataRef.current?.fortunes ?? []) {
    //     await new Promise((resolve) => setTimeout(resolve, 2000));
    //     console.log('effect', fortune);
    //     telop.showPop(`${fortune.name} +${fortune.power} を獲得`);
    //   }
    // })();

    await new Promise((resolve) => setTimeout(resolve, 2000));

    let tokuId: TokuId = 'saisen_50';
    switch (value) {
      case 50:
        sisenValue.current = 50;
        sisenValueTextSize.current = '5xl';
        tokuId = 'saisen_50';
        break;
      case 100:
        sisenValue.current = 100;
        sisenValueTextSize.current = '4xl';
        tokuId = 'saisen_100';
        break;
      case 500:
        sisenValue.current = 500;
        sisenValueTextSize.current = '4xl';
        tokuId = 'saisen_500';
        break;
    }
    props.handleTokuUsed(tokuId);

    // 両方完了まで待つ
    const saisenData = await saisenPromise;
    console.log('saisenData', saisenData);

    setIsThrowing(false);
  };

  return (
    <>
      <div className={`${isThrowing ? 'hidden' : ''}`}>
        <div className="relative max-w-2xl min-w-[20rem] top-[37.5rem] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
          <div className="relative h-full w-full bg-black/50 rounded-lg flex flex-col gap-2 p-4">
            <div className="">
              <TextReveal
                text="拝殿。神様に祈りを捧げるための場所です。"
                delayPerChar={0.1}
                className="text-xl md:text-2xl font-bold"
              />
            </div>
          </div>

          <div className="relative w-full bg-black/50 rounded-lg flex flex-col items-center gap-2 p-4">
            <div className="w-full text-xl flex flex-col gap-4 items-start">
              信じる者は救われるかも。
            </div>
            <Button
              variant="positive"
              size="lg"
              onClick={() => {
                throwCoin(50);
              }}
              className="w-full max-w-md flex flex-col pt-2 pb-2"
            >
              <div className="text-xl font-bold">賽銭を投げる</div>
            </Button>
          </div>
        </div>
      </div>

      {isThrowing && (
        <>
          <div className="saisen animate-throw-coin">
            <div className="animate-rotate-coin">
              <p
                className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-3/5 text-${sisenValueTextSize.current} font-bold text-shadow-huchi`}
              >
                {sisenValue.current}
              </p>
            </div>
          </div>
          <div className="animate-saisen-se text-shadow-huchi2 text-amber-50">チャリン</div>
        </>
      )}
    </>
  );
};

export default React.memo(HaidenSection);
