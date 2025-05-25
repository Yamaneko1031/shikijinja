'use client';

import React from 'react';
import Image from 'next/image';
import { OmikujiResponse, OmikujiType } from '@/types/omikuji';
import { Button } from '../_shared/Button';
import { omikujiNameList, omikujiMonthList } from '@/config/omikuji';

type Props = {
  omikujiResponse: OmikujiResponse;
  omikujiType: OmikujiType;
  onClose: () => void;
};

export default function OmikujiModal({ omikujiResponse, omikujiType, onClose }: Props) {
  const omikujiName = omikujiNameList[omikujiType];
  return (
    // 半透明のオーバーレイ
    <div className="">
      {/* 閉じるボタン */}
      <Button
        variant="negative"
        size="md"
        onClick={onClose}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20"
        aria-label="閉じる"
      >
        閉じる
      </Button>
      <div className="relative w-[420px] m-auto min-w-[420px] h-[100vh] min-h-[900px] flex items-center justify-center">
        {/* 紙テクスチャのウィンドウ */}
        <Image
          className="absolute h-auto w-full pl-[10px] pr-[10px] pt-[10px]"
          src="/images/omikuji/omikuji.webp"
          alt="omikuji_bg"
          width={400}
          height={800}
          priority
        />
        <div className="relative w-[400px] -mt-10 pt-6 pl-12 pr-12 text-black flex flex-col">
          {/* おみくじ名 */}
          <h2 className="w-full h-10 text-center text-2xl font-bold">【{omikujiName}】</h2>
          {/* 運勢表示 */}
          <div className="w-full h-14 mt-4 flex" style={{ color: '#D44439' }}>
            <div className="w-1/2 h-full text-2xl font-bold flex items-center justify-center">
              {(() => {
                switch (omikujiType) {
                  case '今年':
                    return `${new Date(omikujiResponse.createdAt).getFullYear()}年 運勢`;
                  case '今月':
                    return `${omikujiMonthList[new Date(omikujiResponse.createdAt).getMonth()]}`;
                  case '明日':
                    return (
                      <div className="w-20">
                        <Image
                          src={`/images/omikuji/neko_stamp${omikujiResponse.fortuneNumber}.webp`}
                          alt="neko_stamp"
                          width={256}
                          height={160}
                        />
                      </div>
                    );
                  default:
                    return '';
                }
              })()}
            </div>
            <div className="w-1/2 h-full text-5xl font-bold flex items-center justify-center">
              {omikujiResponse.fortune}
            </div>
          </div>
          {/* 本文 */}
          <p
            className={`w-full h-42 vertical font-otsutome text-left flex justify-center items-center mt-5 ${
              omikujiResponse.msg.length > 130 ? 'text-[14px]' : 'text-[16px]'
            }`}
          >
            {omikujiResponse.msg}
          </p>
          {/* 詳細リスト */}
          <div className="grid grid-cols-5 gap-x-1 gap-y-9 text-sm mt-7">
            {/* grid内を右上から配置したいので、配列をソートしてから表示 */}
            {[...omikujiResponse.details]
              .sort((a, b) => {
                const order = [4, 3, 2, 1, 0, 9, 8, 7, 6, 5];
                return (
                  order.indexOf(omikujiResponse.details.indexOf(a)) -
                  order.indexOf(omikujiResponse.details.indexOf(b))
                );
              })
              .map((d) => (
                <div key={d.type} className="flex justify-start items-start h-45 text-left">
                  <div className="font-otsutome w-[40px] mt-4 vertical align-top">{d.element}</div>
                  <div
                    className={`font-otsutome vertical align-top ${
                      d.type.length > 10 ? 'text-[12px]' : ''
                    }`}
                  >
                    {d.type}★{d.rank}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
