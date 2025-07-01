'use client';

import React, { useRef, useState } from 'react';
import TextReveal from '@/components/_shared/TextReveal';
import {
  OmikujiResponse,
  OmikujiRequest,
  OmikujiFortuneResponse,
  OmikujiDetail,
  OmikujiType,
} from '@/types/omikuji';
import Modal from '../_shared/Modal';
import OmikujiModal from './OmikujiModal';
import { apiFetch } from '@/lib/api';
import OmikujiLoding from './OmikujiLoding';
import Image from 'next/image';
import OmikujiSelector from './OmikujiSelector';
import OmikujiButton from './OmikujiButton';
import { getTokuCoin, getTokuMaster } from '@/utils/toku';
import { SectionProps } from '@/types/section';
import Head from 'next/head';
import { mutate } from 'swr';
import { useLoadImages } from '@/hooks/useLoadImages';

const OmikujiSection = (props: SectionProps) => {
  console.log('OmikujiSection', props.isActive, props.isNeighbor);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSelector, setIsSelector] = useState(false);
  const resultRef = useRef<OmikujiResponse | null>(null);
  const omikujiTypeRef = useRef<OmikujiType>('omikuji');
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);
  const loadedImages = useLoadImages(props.isActive || props.isNeighbor, [
    '/images/omikuji/hitohira.webp',
    '/images/omikuji/nekobiyori.webp',
    '/images/omikuji/omikuji.webp',
    '/images/bg_hude/bg_washi.webp',
  ]);
  loadedImagesRef.current = loadedImages;

  const omikujiConfig = {
    omikuji: {
      id: 'omikuji_omikuji',
      period: '今年',
      name: 'おみくじ',
      needsSelector: true,
    },
    hitohira: {
      id: 'omikuji_hitohira',
      period: '今月',
      name: 'ひとひらくじ',
      needsSelector: true,
    },
    nekobiyori: {
      id: 'omikuji_nekobiyori',
      period: '明日',
      name: 'ねこ日和',
      needsSelector: false,
    },
  } as const;

  const onClickOmikuji = (omikujiType: OmikujiType) => {
    const config = omikujiConfig[omikujiType];
    const tokudata = getTokuMaster(config.id);

    if (props.handleIsLimitOver(config.id)) {
      alert(`今日はもう引けません。\n${config.name}は1日${tokudata?.limit}回まで。`);
      return;
    }

    if (!props.handleIsEnoughCoin(config.id)) {
      alert(`徳が足りません。\n${config.name}は1回${tokudata?.coin}徳です。`);
      return;
    }

    if (config.needsSelector) {
      setIsSelector(true);
    } else {
      fetchOmikujiJob(omikujiType, '');
    }
    omikujiTypeRef.current = omikujiType;
  };

  const fetchOmikujiJob = async (omikujiType: OmikujiType, job: string) => {
    setIsSelector(false);
    setLoading(true);

    try {
      const bodyFortune = { omikujiType };
      const dataFortune = await apiFetch<OmikujiFortuneResponse>('/api/omikuji/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyFortune),
      });

      const config = omikujiConfig[omikujiType];
      const body: OmikujiRequest = {
        job,
        fortuneNumber: dataFortune.fortune,
        period: config.period,
        type: omikujiType,
      };

      const res: {
        details: OmikujiDetail[];
        fortune: string;
        msg: string;
      } = await apiFetch('https://omikuji-245510097867.asia-northeast1.run.app', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      try {
        const bodySave = {
          details: res.details,
          fortune: res.fortune,
          msg: res.msg,
          job,
          period: config.period,
          fortuneNumber: dataFortune.fortune,
          type: omikujiType,
        };
        const omikujiResponse = await apiFetch<OmikujiResponse>('/api/omikuji/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodySave),
        });
        console.log('omikuji', omikujiResponse);

        resultRef.current = omikujiResponse;
        setIsOpen(true);

        switch (omikujiType) {
          case 'omikuji':
            props.handleTokuUsed('omikuji_omikuji');
            break;
          case 'hitohira':
            props.handleTokuUsed('omikuji_hitohira');
            break;
          case 'nekobiyori':
            props.handleTokuUsed('omikuji_nekobiyori');
            break;
        }
        await mutate('/api/user/items');
      } catch (err) {
        console.error(err);
        alert('おみくじの保存に失敗しました。' + err);
      }
    } catch (err) {
      console.error(err);
      alert('おみくじが出てきませんでした。再度お試しください。\n' + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <link rel="preload" href="/images/omikuji/omikuji.webp" as="image" />
      </Head>

      <div className="relative max-w-2xl min-w-[20rem] top-[38rem] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <div className="relative h-full w-full bg-black/50 rounded-lg flex flex-col gap-2 pt-4 pl-4 pb-4 pr-[11.25rem]">
          <div className="">
            <TextReveal
              text="おみくじを引いていくかにゃ？"
              delayPerChar={0.1}
              className="text-xl md:text-2xl font-bold"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-[12rem]">
            <Image
              src="/images/omikuji/neko_omikuji.webp"
              alt="neko_omikuji"
              width={400}
              height={300}
            />
          </div>
        </div>
        <div className="relative h-full w-full bg-black/50 rounded-lg flex flex-row gap-2 p-4">
          <OmikujiButton
            title="明日"
            imagePath="/images/omikuji/omikuji_box_nekobiyori.webp"
            imageAlt="omikuji_box_nekobiyori"
            onClick={() => onClickOmikuji('nekobiyori')}
            type="nekobiyori"
            coin={getTokuCoin('omikuji_nekobiyori')}
          />
          <OmikujiButton
            title="今月"
            imagePath="/images/omikuji/omikuji_box_hitohira.webp"
            imageAlt="omikuji_box_hitohira"
            onClick={() => onClickOmikuji('hitohira')}
            type="hitohira"
            coin={getTokuCoin('omikuji_hitohira')}
          />
          <OmikujiButton
            title="今年"
            imagePath="/images/omikuji/omikuji_box_simple.webp"
            imageAlt="omikuji_box_simple"
            onClick={() => onClickOmikuji('omikuji')}
            type="omikuji"
            coin={getTokuCoin('omikuji_omikuji')}
          />
        </div>
      </div>

      {/* おみくじ抽選中画面 */}
      <Modal isOpen={loading} className="relative min-w-[20rem] w-[30rem] mx-2 overscroll-contain">
        <OmikujiLoding />
      </Modal>

      {/* 職業選択画面 */}
      <Modal isOpen={isSelector}>
        <OmikujiSelector
          onSelect={(job) => {
            fetchOmikujiJob(omikujiTypeRef.current, job);
            // setIsSelector(false)はfetchOmikujiJob内で行っている
          }}
          onCancel={() => {
            setIsSelector(false);
          }}
        />
      </Modal>

      {/* おみくじ結果画面 */}
      {resultRef.current !== null && (
        <Modal
          isOpen={isOpen}
          className="absolute top-0 left-0 min-h-[100lvh] min-w-[100vw] bg-transparent overscroll-contain"
        >
          <OmikujiModal
            omikujiResponse={resultRef.current}
            onClose={() => {
              setIsOpen(false);
              resultRef.current = null;
            }}
            handleIsLimitOver={props.handleIsLimitOver}
            handleTokuGet={props.handleTokuGet}
          ></OmikujiModal>
        </Modal>
      )}

      {/* おみくじ背景画像を明示的にプリロード */}
      {}
      {/* <img
        src="/images/omikuji/omikuji.webp"
        alt="omikuji_bg_preload"
        style={{ display: 'none' }}
        width={400}
        height={800}
      /> */}
    </>
  );
};

export default React.memo(OmikujiSection);
