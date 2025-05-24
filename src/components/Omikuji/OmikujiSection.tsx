'use client';

import React, { useRef, useState } from 'react';
import TextReveal from '@/components/_shared/TextReveal';
import {
  OmikujiResponse,
  OmikujiType,
  OmikujiRequest,
  OmikujiFortuneResponse,
} from '@/types/omikuji';
import Modal from '../_shared/Modal';
import OmikujiModal from './OmikujiModal';
import { apiFetch } from '@/lib/api';
import OmikujiLoding from './OmikujiLoding';
import Image from 'next/image';
import OmikujiSelector from './OmikujiSelector';
import OmikujiButton from './OmikujiButton';
import { User } from '@/types/user';
import { TokuId } from '@/types/toku';
import { getTokuCoin, getTokuLimit } from '@/utils/toku';

type Props = {
  isActive: boolean;
  isNeighbor: boolean;
  user: User;
  handleAddCoin: (coin: number) => void;
  handleIsLimitOver: (tokuId: TokuId) => boolean;
  handleTokuGet: (tokuId: TokuId) => void;
  handleTokuUsed: (tokuId: TokuId) => void;
  handleIsEnoughCoin: (tokuId: TokuId) => boolean;
};

const OmikujiSection = (props: Props) => {
  console.log('OmikujiSection', props.isActive, props.isNeighbor);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSelector, setIsSelector] = useState(false);
  const resultRef = useRef<OmikujiResponse | null>(null);
  const omikujiTypeRef = useRef<OmikujiType>('今年');

  const onClickOmikuji = (omikujiType: OmikujiType) => {
    switch (omikujiType) {
      case '今年':
        if (props.handleIsLimitOver('omikuji_omikuji')) {
          alert(`今日はもう引けません。\nおみくじは1日${getTokuLimit('omikuji_omikuji')}回まで。`);
          return;
        }
        if (!props.handleIsEnoughCoin('omikuji_omikuji')) {
          alert(`徳が足りません。\nおみくじは1回${getTokuCoin('omikuji_omikuji')}徳です。`);
          return;
        }
        setIsSelector(true);
        break;
      case '今月':
        if (props.handleIsLimitOver('omikuji_hitohira')) {
          alert(
            `今日はもう引けません。\nひとひらくじは1日${getTokuLimit('omikuji_hitohira')}回まで。`
          );
          return;
        }
        if (!props.handleIsEnoughCoin('omikuji_hitohira')) {
          alert(`徳が足りません。\nひとひらくじは1回${getTokuCoin('omikuji_hitohira')}徳です。`);
          return;
        }
        setIsSelector(true);
        break;
      case '明日':
        if (props.handleIsLimitOver('omikuji_nekobiyori')) {
          alert(
            `今日はもう引けません。\nねこ日和は1日${getTokuLimit('omikuji_nekobiyori')}回まで。`
          );
          return;
        }
        if (!props.handleIsEnoughCoin('omikuji_nekobiyori')) {
          alert(`徳が足りません。\nねこ日和は1回${getTokuCoin('omikuji_nekobiyori')}徳です。`);
          return;
        }
        fetchOmikujiJob(omikujiType, '');
        break;
    }
    omikujiTypeRef.current = omikujiType;
  };

  const fetchOmikujiJob = async (omikujiType: OmikujiType, job: string) => {
    try {
      const bodyFortune = { omikujiType };
      const dataFortune = await apiFetch<OmikujiFortuneResponse>('/api/omikuji/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyFortune),
      });

      setIsSelector(false);
      setLoading(true);

      let apiUri = '';
      switch (omikujiType) {
        case '今年':
        case '今月':
          apiUri = '/api/omikuji/free';
          break;
        case '明日':
          apiUri = '/api/omikuji/neko';
          break;
      }

      const body: OmikujiRequest = {
        job,
        fortuneNumber: dataFortune.fortune,
        period: omikujiType,
      };

      const res: Response = await apiFetch(apiUri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        raw: true,
      });

      // Uint8Array[]にバッファしてからdecode
      let text = '';
      const decoder = new TextDecoder();
      const chunks: Uint8Array[] = [];

      if (res.body) {
        if (res.body[Symbol.asyncIterator]) {
          for await (const chunk of res.body) {
            chunks.push(chunk);
          }
        } else if (res.body.getReader) {
          const reader = res.body.getReader();
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            if (value) chunks.push(value);
          }
        }

        const totalLength = chunks.reduce((acc, val) => acc + val.length, 0);
        const full = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
          full.set(chunk, offset);
          offset += chunk.length;
        }

        text = decoder.decode(full);
      } else {
        text = await res.text(); // フォールバック
      }

      const omikujiResponse: OmikujiResponse = {
        ...JSON.parse(text),
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

      <Image
        src="/images/omikuji/omikuji.webp"
        alt="omikuji_bg"
        width={400}
        height={800}
        style={{ display: 'none' }} // ユーザーに見せない
      />
    </>
  );
};

export default React.memo(OmikujiSection);
