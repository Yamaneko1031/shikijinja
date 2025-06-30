'use client';

import React, { useRef, useState } from 'react';
import TextReveal from '@/components/_shared/TextReveal';
import { SectionProps } from '@/types/section';
import { Button } from '../_shared/Button';
import { useLoadImages } from '@/hooks/useLoadImages';
import { apiFetch } from '@/lib/api';
import { SaisenResponse } from '@/types/saisen';
import Modal from '../_shared/Modal';

type InoriState = 'none' | 'select' | 'throw' | 'inori' | 'inori_waiting' | 'inori_result';

const HaidenSection = (props: SectionProps) => {
  const [inoriState, setInoriState] = useState<InoriState>('none');
  const sisenValue = useRef(0);
  const sisenValueTextSize = useRef('');
  const inoriResultText = useRef('');
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);
  const loadedImages = useLoadImages(props.isActive || props.isNeighbor, [
    '/images/icon/icon_coin_nadeneko.webp',
  ]);
  loadedImagesRef.current = loadedImages;

  const throwCoin = async (value: number) => {
    setInoriState('throw');
    try {
      const coin = props.user.coin - value;
      if (coin < 0) {
        alert('コインが不足しています。');
        setInoriState('none');
        return;
      }
      props.handleAddCoin(-value);

      const saisenPromise = apiFetch<SaisenResponse>('/api/saisen', {
        method: 'POST',
        body: JSON.stringify({ value }),
      });

      sisenValue.current = value;
      switch (value) {
        case 50:
          sisenValueTextSize.current = '5xl';
          break;
        case 100:
          sisenValueTextSize.current = '4xl';
          break;
        case 500:
          sisenValueTextSize.current = '4xl';
          break;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setInoriState('inori_waiting');

      // 両方完了まで待つ
      const saisenData = await saisenPromise;

      inoriResultText.current =
        saisenData.fortune.name + ' が ' + saisenData.fortune.power + ' 上昇しました。';

      console.log(saisenData.fortunes);
      console.log('saisenData', saisenData);

      console.log('coin', props.user.coin);

      props.handleSetUser({
        ...props.user,
        fortunes: saisenData.fortunes,
        coin: coin,
      });
      props.handleTokuUsed('saisen', false);
      setInoriState('inori');
    } catch (error) {
      console.error('エラー', error);
      alert('エラーが発生しました。再度試してください。');
      setInoriState('none');
      props.handleAddCoin(0);
    }
  };

  const inoriFinish = async () => {
    setInoriState('inori_result');
    await new Promise((resolve) => setTimeout(resolve, 5000));
    setInoriState('none');
  };

  return (
    <>
      <div className={`${inoriState === 'none' || inoriState === 'select' ? '' : 'hidden'}`}>
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
              賽銭を投げてお祈りをしましょう。信じる者は救われるかも。
            </div>
            <Button
              variant="positive"
              size="lg"
              onClick={() => {
                // throwCoin(50);
                setInoriState('select');
              }}
              disabled={inoriState !== 'none'}
              className="w-full max-w-md flex flex-col pt-2 pb-2"
            >
              <div className="text-xl font-bold">賽銭を投げる</div>
            </Button>
          </div>
        </div>
      </div>

      <Modal isOpen={inoriState === 'select'}>
        <div>いくら投げますか？</div>
        <div>
          <Button variant="positive" size="lg" onClick={() => throwCoin(50)}>
            50
          </Button>
          <Button variant="positive" size="lg" onClick={() => throwCoin(100)}>
            100
          </Button>
          <Button variant="positive" size="lg" onClick={() => throwCoin(500)}>
            500
          </Button>
          <Button variant="negative" size="lg" onClick={() => setInoriState('none')}>
            キャンセル
          </Button>
        </div>
      </Modal>

      {inoriState === 'throw' && (
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

      {(inoriState === 'inori' || inoriState === 'inori_waiting') && (
        <>
          <div className="fixed top-0 left-0 w-full h-full bg-black/90 flex flex-col items-center justify-center z-61 fade-in">
            <div className="text-2xl font-bold">目を瞑り、手を当てて祈りを捧げましょう。</div>
            <div className="fixed w-full bottom-6 m-auto flex flex-row justify-center gap-2">
              <Button
                variant="negative"
                size="lg"
                disabled={inoriState === 'inori_waiting'}
                onClick={() => inoriFinish()}
              >
                お祈りを終える
              </Button>
            </div>
          </div>
        </>
      )}

      {inoriState === 'inori_result' && (
        <>
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/70 flex flex-col items-center justify-center"
            onClick={() => setInoriState('none')}
          >
            <TextReveal
              text={inoriResultText.current}
              delayPerChar={0.1}
              className="text-2xl font-bold"
            />
          </div>
        </>
      )}
    </>
  );
};

export default React.memo(HaidenSection);
