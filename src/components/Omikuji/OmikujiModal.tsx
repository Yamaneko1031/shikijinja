'use client';

import React from 'react';
import Image from 'next/image';
import { OmikujiResponse } from '@/types/omikuji';
import { Button } from '../shared/Button';

type Props = {
  omikujiResponse: OmikujiResponse;
  onClose: () => void;
};

export default function OmikujiModal({ omikujiResponse, onClose }: Props) {
  return (
    // 半透明のオーバーレイ
    <div className="relative w-[420px] m-auto min-w-[420px] min-h-[900px] flex justify-center">
      {/* 閉じるボタン */}
      <Button
        variant="negative"
        size="md"
        onClick={onClose}
        className="fixed bottom-2 left-1/2 -translate-x-1/2 z-20"
        aria-label="閉じる"
      >
        閉じる
      </Button>
      {/* 紙テクスチャのウィンドウ */}
      <Image
        className="absolute h-auto w-full pl-[10px] pr-[10px] pt-[30px]"
        src="/images/omikuji/omikuji.webp"
        alt="おみくじ"
        width={400}
        height={800}
      />
      <div className="relative w-[400px] mt-8 pt-6 pl-12 pr-12 text-black flex flex-col">
        {/* ヘッダー */}
        <h2 className="w-full h-10 text-center text-3xl font-bold">
          おみくじ【{omikujiResponse.type}】
        </h2>
        {/* ヘッダー */}
        <h2
          className="w-full h-14 text-center text-5xl font-bold mt-4"
          style={{ color: '#D44439' }}
        >
          {omikujiResponse.fortune}
        </h2>
        {/* 本文 */}
        <p className="w-full h-42 vertical text-left text-[16px] flex justify-center items-center mt-5">
          {omikujiResponse.msg}
        </p>
        {/* 詳細リスト（スクロール可能領域） */}
        <div dir="rtl" className="grid grid-cols-5 gap-x-3 gap-y-9 text-sm mt-7">
          {omikujiResponse.details.map((d) => (
            <div key={d.type} className="flex items-start h-45 w-12 text-left">
              <div className="vertical font-semibold">
                {d.type}【{d.rank}】
              </div>
              {/* <div className="my-1">{'★'.repeat(d.rank).padEnd(5, '☆')}</div> */}
              <div className="mt-4 vertical align-top">{d.element}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
