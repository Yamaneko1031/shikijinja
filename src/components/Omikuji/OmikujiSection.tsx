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

type Props = {
  isActive: boolean;
  isNeighbor: boolean;
};

const OmikujiSection = ({ isActive, isNeighbor }: Props) => {
  console.log('OmikujiSection', isActive, isNeighbor);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSelector, setIsSelector] = useState(false);
  const resultRef = useRef<OmikujiResponse | null>(null);
  const omikujiTypeRef = useRef<OmikujiType>('今年');

  const onClickOmikuji = (omikujiType: OmikujiType) => {
    switch (omikujiType) {
      case '今年':
        setIsSelector(true);
        break;
      case '今月':
        setIsSelector(true);
        break;
      case '明日':
        fetchOmikujiJob(omikujiType, '');
        break;
    }
    omikujiTypeRef.current = omikujiType;
  };

  const fetchOmikujiJob = async (omikujiType: OmikujiType, job: string) => {
    try {
      const bodyFortune = {
        omikujiType: omikujiType,
      };
      const dataFortune = await apiFetch<OmikujiFortuneResponse>('/api/omikuji/fortune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        job: job,
        fortuneNumber: dataFortune.fortune,
        period: omikujiType,
      };

      const res: Response = await apiFetch(apiUri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        raw: true,
      });
      const decoder = new TextDecoder();
      let text = '';

      if (res.body) {
        // ネイティブ async-iterable 対応ブラウザ
        if (res.body[Symbol.asyncIterator]) {
          for await (const chunk of res.body) {
            text += decoder.decode(chunk, { stream: true });
          }
        }
        // asyncIterator 未対応ブラウザ
        else if (res.body.getReader) {
          const reader = res.body.getReader();
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            text += decoder.decode(value);
          }
        }
      } else {
        // そもそもストリーム非対応（古い iOS など）
        text = await res.text();
      }

      const omikujiResponse = {
        ...JSON.parse(text),
        job: job,
        period: omikujiType,
        fortuneNumber: dataFortune.fortune,
        createdAt: new Date().toISOString(),
      } as OmikujiResponse;

      resultRef.current = omikujiResponse;

      setIsOpen(true);
    } catch (err) {
      console.error(err);
      alert('おみくじが出てきませんでした。再度お試しください。' + err);
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
          />
          <OmikujiButton
            title="今月"
            imagePath="/images/omikuji/omikuji_box_hitohira.webp"
            imageAlt="omikuji_box_hitohira"
            onClick={() => onClickOmikuji('今月')}
            type="今月"
          />
          <OmikujiButton
            title="今年"
            imagePath="/images/omikuji/omikuji_box_simple.webp"
            imageAlt="omikuji_box_simple"
            onClick={() => onClickOmikuji('今年')}
            type="今年"
          />
        </div>
      </div>

      {/* おみくじ抽選中画面 */}
      <Modal
        isOpen={loading}
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50"
      >
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
    </>
  );
};

export default React.memo(OmikujiSection);
