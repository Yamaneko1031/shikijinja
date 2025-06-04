'use client';

import React, { useRef, useState } from 'react';
import TextReveal from '@/components/_shared/TextReveal';
import { SectionProps } from '@/types/section';
import Image from 'next/image';
import { OmamoriData } from '@/types/omamori';
import { apiFetch } from '@/lib/api';
import OmamoriWindow from './OmamoriWindow';
import Modal from '../_shared/Modal';
import OmamoriLoading from './OmamoriLoading';
import OmamoriModal from './OmamoriModal';
// import OmamoriEffectPopup from './OmamoriEffectPopup';
import { useTelop } from '@/hooks/useTelop';
import { getTokuMaster } from '@/utils/toku';

const OmamoriSection = (props: SectionProps) => {
  const [loading, setLoading] = useState(false);
  const [omamoriData, setOmamoriData] = useState<OmamoriData | null>(null);
  const [omamoriModalOpen, setOmamoriModalOpen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const omamoriDataRef = useRef<OmamoriData | null>(null);
  const telop = useTelop();

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

    setOmamoriData(null);
    setLoadingMessage('お守りを選択中');
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    omamoriDataRef.current = await apiFetch<OmamoriData>('/api/omamori/effect', {
      method: 'POST',
    });
    telop.showPop(`${omamoriDataRef.current?.name} が選択されました`);
    console.log('omamoriDataRef.current?.name', omamoriDataRef.current?.name);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setLoadingMessage('効能を付与中');
    setOmamoriData(omamoriDataRef.current);

    // お守りコメントAPIを非同期で実行
    const commentPromise = apiFetch<OmamoriData>('/api/omamori/comment', {
      method: 'POST',
      body: JSON.stringify({ setOmamori: omamoriDataRef.current }),
    });

    // エフェクト演出を開始
    const effectPromise = (async () => {
      for (const effect of omamoriDataRef.current?.effects ?? []) {
        console.log('effect', effect);
        telop.showPop(`${effect.name} +${effect.power} を獲得`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    })();

    // お守りコメントAPIレスポンスを取得
    omamoriDataRef.current = await commentPromise;
    console.log('omamoriDataRef.current', omamoriDataRef.current);

    // 両方完了まで待つ
    await effectPromise;

    props.handleTokuUsed('omamori_buy');
    // ③: 両方終わったらsetOmamoriData
    setOmamoriData(omamoriDataRef.current);

    setLoading(false);
    setOmamoriModalOpen(true);
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
      <Modal isOpen={loading} className="relative min-w-[20rem] w-[30rem] mx-2 overscroll-contain">
        <OmamoriLoading omamoriData={omamoriData} loadingMessage={loadingMessage} />
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

      <Modal isOpen={omamoriModalOpen}>
        {omamoriDataRef.current && (
          <OmamoriModal
            omamoriData={omamoriDataRef.current}
            onClose={() => setOmamoriModalOpen(false)}
          />
        )}
      </Modal>
    </>
  );
};

export default React.memo(OmamoriSection);
