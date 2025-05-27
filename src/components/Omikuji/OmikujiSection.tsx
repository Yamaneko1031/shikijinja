'use client';

import React, { useRef, useState } from 'react';
import TextReveal from '@/components/_shared/TextReveal';
import {
  OmikujiResponse,
  OmikujiType,
  OmikujiRequest,
  OmikujiFortuneResponse,
  OmikujiDetail,
} from '@/types/omikuji';
import Modal from '../_shared/Modal';
import OmikujiModal from './OmikujiModal';
import { apiFetch } from '@/lib/api';
import OmikujiLoding from './OmikujiLoding';
import Image from 'next/image';
import OmikujiSelector from './OmikujiSelector';
import OmikujiButton from './OmikujiButton';
import { getTokuCoin, getTokuLimit } from '@/utils/toku';
import { SectionProps } from '@/types/section';

const OmikujiSection = (props: SectionProps) => {
  console.log('OmikujiSection', props.isActive, props.isNeighbor);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSelector, setIsSelector] = useState(false);
  const resultRef = useRef<OmikujiResponse | null>(null);
  const omikujiTypeRef = useRef<OmikujiType>('今年');

  const onClickOmikuji = (omikujiType: OmikujiType) => {
    const omikujiConfig = {
      今年: {
        id: 'omikuji_omikuji',
        name: 'おみくじ',
        needsSelector: true,
      },
      今月: {
        id: 'omikuji_hitohira',
        name: 'ひとひらくじ',
        needsSelector: true,
      },
      明日: {
        id: 'omikuji_nekobiyori',
        name: 'ねこ日和',
        needsSelector: false,
      },
    } as const;

    const config = omikujiConfig[omikujiType];

    if (props.handleIsLimitOver(config.id)) {
      alert(`今日はもう引けません。\n${config.name}は1日${getTokuLimit(config.id)}回まで。`);
      return;
    }

    if (!props.handleIsEnoughCoin(config.id)) {
      alert(`徳が足りません。\n${config.name}は1回${getTokuCoin(config.id)}徳です。`);
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

      const body: OmikujiRequest = {
        job,
        fortuneNumber: dataFortune.fortune,
        period: omikujiType,
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

      const omikujiResponse: OmikujiResponse = {
        details: res.details,
        fortune: res.fortune,
        msg: res.msg,
        job,
        period: omikujiType,
        fortuneNumber: dataFortune.fortune,
        createdAt: new Date().toISOString(),
      };

      resultRef.current = omikujiResponse;
      setIsOpen(true);

      switch (omikujiType) {
        case '今年':
          props.handleTokuUsed('omikuji_omikuji');
          break;
        case '今月':
          props.handleTokuUsed('omikuji_hitohira');
          break;
        case '明日':
          props.handleTokuUsed('omikuji_nekobiyori');
          break;
      }

      try {
        const bodySave = {
          details: omikujiResponse.details,
          fortune: omikujiResponse.fortune,
          msg: omikujiResponse.msg,
          job: omikujiResponse.job,
          period: omikujiResponse.period,
          fortuneNumber: omikujiResponse.fortuneNumber,
        };
        apiFetch('/api/omikuji/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodySave),
        });
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
      <div className="relative max-w-2xl min-w-[320px] top-[600px] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <div className="relative h-full w-full bg-black/50 rounded-lg flex flex-col gap-2 pt-4 pl-4 pb-4 pr-[180px]">
          <div className="">
            <TextReveal
              text="おみくじを引いていくかにゃ？"
              delayPerChar={0.1}
              className="text-xl md:text-2xl font-bold"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-[200px]">
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
            onClick={() => onClickOmikuji('明日')}
            type="明日"
            coin={getTokuCoin('omikuji_nekobiyori')}
          />
          <OmikujiButton
            title="今月"
            imagePath="/images/omikuji/omikuji_box_hitohira.webp"
            imageAlt="omikuji_box_hitohira"
            onClick={() => onClickOmikuji('今月')}
            type="今月"
            coin={getTokuCoin('omikuji_hitohira')}
          />
          <OmikujiButton
            title="今年"
            imagePath="/images/omikuji/omikuji_box_simple.webp"
            imageAlt="omikuji_box_simple"
            onClick={() => onClickOmikuji('今年')}
            type="今年"
            coin={getTokuCoin('omikuji_omikuji')}
          />
        </div>
      </div>

      {/* おみくじ抽選中画面 */}
      <Modal isOpen={loading} className="relative min-w-[340px] w-[500px] mx-2 overscroll-contain">
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
            omikujiType={omikujiTypeRef.current}
            onClose={() => {
              setIsOpen(false);
              resultRef.current = null;
            }}
          ></OmikujiModal>
        </Modal>
      )}

      {/* おみくじ背景画像を明示的にプリロード */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/omikuji/omikuji.webp"
        alt="omikuji_bg_preload"
        style={{ display: 'none' }}
        width={400}
        height={800}
      />
    </>
  );
};

export default React.memo(OmikujiSection);
