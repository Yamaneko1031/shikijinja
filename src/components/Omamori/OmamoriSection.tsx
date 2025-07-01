'use client';

import React, { useRef, useState } from 'react';
import TextReveal from '@/components/_shared/TextReveal';
import { SectionProps } from '@/types/section';
import Image from 'next/image';
import { OmamoriDataResponse } from '@/types/omamori';
import { apiFetch } from '@/lib/api';
import OmamoriWindow from './OmamoriWindow';
import Modal from '../_shared/Modal';
import OmamoriLoading from './OmamoriLoading';
import OmamoriModal from './OmamoriModal';
import { useTelop } from '@/hooks/useTelop';
import { getTokuMaster } from '@/utils/toku';
import { mutate } from 'swr';
import { OmamoriLoadingState } from '@/types/omamori';
import { useLoadImages } from '@/hooks/useLoadImages';

const OmamoriSection = (props: SectionProps) => {
  const [omamoriModalOpen, setOmamoriModalOpen] = useState(false);
  const [loadingState, setLoadingState] = useState<OmamoriLoadingState>('none');
  const omamoriDataRef = useRef<OmamoriDataResponse | null>(null);
  const telop = useTelop();
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);
  const loadedImages = useLoadImages(props.isActive || props.isNeighbor, [
    '/images/bg_hude/bg_kanteisho.webp',
    '/images/bg_hude/bg_washi.webp',
  ]);
  loadedImagesRef.current = loadedImages;

  const handlePurchase = async () => {
    const tokudata = getTokuMaster('omamori_buy');
    if (tokudata) {
      if (props.handleIsLimitOver(tokudata.tokuId)) {
        alert(`今日はもう買えません。\n${tokudata.label}は1日${tokudata.limit}回まで。`);
        return;
      }
      if (!props.handleIsEnoughCoin(tokudata.tokuId)) {
        alert(`徳が足りません。\n${tokudata.label}は1回${tokudata.coin}徳です。`);
        return;
      }
    }

    telop.clear();
    setLoadingState('shuffle');

    await new Promise((resolve) => setTimeout(resolve, 2000));
    omamoriDataRef.current = await apiFetch<OmamoriDataResponse>('/api/omamori/fortune', {
      method: 'POST',
    });

    if (!omamoriDataRef.current) {
      alert('お守りの作成に失敗しました。');
      return;
    }
    // お守りコメントAPIを非同期で実行
    const commentPromise = apiFetch<OmamoriDataResponse>('/api/omamori/comment', {
      method: 'POST',
      body: JSON.stringify({ omamoriId: omamoriDataRef.current.id }),
    });

    // 演出
    telop.showPop(`${omamoriDataRef.current.name} が選択されました`);
    setLoadingState('stop');

    // 選択されたお守りを表示する待ち時間
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setLoadingState('fortune');

    // エフェクト演出を開始
    const effectPromise = (async () => {
      for (const fortune of omamoriDataRef.current?.fortunes ?? []) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log('effect', fortune);
        telop.showPop(`${fortune.name} +${fortune.power} を獲得`);
      }
    })();

    // 両方完了まで待つ
    omamoriDataRef.current = await commentPromise;
    await effectPromise;

    await new Promise((resolve) => setTimeout(resolve, 1500));

    props.handleTokuUsed('omamori_buy');

    setLoadingState('none');
    setOmamoriModalOpen(true);

    await mutate('/api/user/items');
  };

  return (
    <>
      <div className="relative max-w-2xl min-w-[20rem] top-[37.5rem] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <div className="relative h-full w-full bg-black/50 rounded-lg flex flex-col gap-2 pt-4 pl-4 pb-4 pr-[11.25rem]">
          <div className="">
            <TextReveal
              text="お守りがあるにゃ！"
              delayPerChar={0.1}
              className="text-xl md:text-2xl font-bold"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-[12.5rem]">
            <Image
              src="/images/omamori/neko_omamori.webp"
              alt="neko_omamori"
              width={400}
              height={300}
            />
          </div>
        </div>
        <OmamoriWindow
          handlePurchase={handlePurchase}
          handleIsEnoughCoin={props.handleIsEnoughCoin}
        />
      </div>

      {/* おみくじ抽選中画面 */}
      <Modal
        isOpen={loadingState != 'none'}
        className="relative min-w-[20rem] w-[30rem] mx-2 overscroll-contain"
      >
        <OmamoriLoading omamoriData={omamoriDataRef.current} loadingState={loadingState} />
        {/* 獲得テロップ表示 */}
        {telop.currentText && (
          <div
            key={telop.currentId.current}
            className="absolute top-1/2 left-1/2 -translate-y-1/2 bg-black/80 rounded-sm p-2 text-xl animate-omamori-effect-popup"
          >
            {telop.currentText}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={omamoriModalOpen}
        className="absolute top-0 left-0 min-h-[100lvh] min-w-[100vw] bg-transparent overscroll-contain"
      >
        {omamoriDataRef.current && (
          <OmamoriModal
            omamoriData={omamoriDataRef.current}
            onClose={() => setOmamoriModalOpen(false)}
            handleIsLimitOver={props.handleIsLimitOver}
            handleTokuGet={props.handleTokuGet}
          />
        )}
      </Modal>
    </>
  );
};

export default React.memo(OmamoriSection);
