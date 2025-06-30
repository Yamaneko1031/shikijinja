'use client';

import React, { useRef, useState } from 'react';
import TextReveal from '@/components/_shared/TextReveal';
import { SectionProps } from '@/types/section';
import { Button } from '../_shared/Button';
import { useLoadImages } from '@/hooks/useLoadImages';
import { apiFetch } from '@/lib/api';
import { SaisenResponse } from '@/types/saisen';
import Modal from '../_shared/Modal';
import Image from 'next/image';
import useSWR from 'swr';
type InoriState = 'none' | 'select' | 'throw' | 'inori' | 'inori_waiting' | 'inori_result';

const HaidenSection = (props: SectionProps) => {
  const [inoriState, setInoriState] = useState<InoriState>('none');
  const sisenValue = useRef(0);
  const sisenValueTextSize = useRef('');
  const inoriResultText = useRef('');
  const inoriResultTimeout = useRef<NodeJS.Timeout | null>(null);
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);
  const loadedImages = useLoadImages(props.isActive || props.isNeighbor, [
    '/images/icon/icon_coin_nadeneko.webp',
  ]);
  loadedImagesRef.current = loadedImages;

  const fetcher = (url: string) => apiFetch<{ totalSaisen: number }>(url).then((res) => res);
  const {
    data: totalSaisen,
    isLoading: isLoadingTotalSaisen,
    mutate: mutateTotalSaisen,
  } = useSWR('/api/saisen/total', fetcher, {
    revalidateOnFocus: false,
  });

  const SaisenSelect = [
    { value: 50, text: 'ちょっと' },
    { value: 100, text: 'ふつう' },
    { value: 500, text: 'たくさん' },
  ];

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
        saisenData.fortune.name + ' が ' + saisenData.fortune.power + ' 上昇';

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
      mutateTotalSaisen();
    } catch (error) {
      console.error('エラー', error);
      alert('エラーが発生しました。再度試してください。');
      setInoriState('none');
      props.handleAddCoin(0);
    }
  };

  const inoriFinish = async () => {
    setInoriState('inori_result');
    inoriResultTimeout.current = setTimeout(() => {
      setInoriState('none');
    }, 5000);
  };

  const cancelInoriResult = () => {
    if (inoriResultTimeout.current) {
      clearTimeout(inoriResultTimeout.current);
    }
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
            <div className="w-full">
              {isLoadingTotalSaisen || !totalSaisen ? (
                <div className="">累計：</div>
              ) : (
                <div className="">累計：{totalSaisen.totalSaisen}徳</div>
              )}
            </div>
            <Button
              variant="positive"
              size="lg"
              onClick={() => {
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
        <div className="flex flex-col gap-2">
          <div className="text-xl font-bold">いくら投げますか？</div>
          <div className="flex flex-col items-center gap-4">
            {SaisenSelect.map((saisen) => (
              <Button
                key={saisen.value}
                variant="positive"
                size="md"
                onClick={() => throwCoin(saisen.value)}
                className="w-[12rem] flex flex-col"
              >
                <div className="text-xl">{saisen.text}</div>
                <div className="flex flex-row items-center">
                  <Image
                    src="/images/icon/icon_coin.webp"
                    alt="omikuji_button"
                    width={24}
                    height={24}
                  />
                  <div className="text-yellow-400">{saisen.value}消費</div>
                </div>
              </Button>
            ))}
            <Button variant="negative" size="lg" onClick={() => setInoriState('none')}>
              キャンセル
            </Button>
          </div>
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
          <div className="fixed top-0 left-0 w-full h-full bg-black/90 flex flex-col items-center justify-center z-61 fade-in px-8">
            <div className="text-2xl font-bold">目を瞑り、手を当てて祈りを捧げましょう</div>
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
            className="fixed top-0 left-0 w-full h-full bg-black/70 flex flex-col items-center justify-center px-8 saisen-result-fade-out"
            onClick={() => cancelInoriResult()}
          >
            <TextReveal
              text={inoriResultText.current}
              delayPerChar={0.1}
              className="text-3xl font-bold"
            />
          </div>
        </>
      )}
    </>
  );
};

export default React.memo(HaidenSection);
