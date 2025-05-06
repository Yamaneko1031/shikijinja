'use client';

import React from 'react';
import Image from 'next/image';
import { OmikujiResult } from '@/types/omikuji';
import { Button } from '../shared/Button';

type Props = {
  omikujiResult: OmikujiResult;
  onClose: () => void;
};

export default function OmikujiModal({ omikujiResult, onClose }: Props) {
  return (
    // 半透明のオーバーレイ
    <div className="relative w-[420px] m-auto min-w-[420px] min-h-[800px] flex justify-center">
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
        src="/images/omikuji/omikuji.png"
        alt="おみくじ"
        width={512}
        height={885}
      />
      <div className="relative p-14 text-black">
        {/* ヘッダー */}
        <h2 className="w-full h-10 text-center text-2xl font-bold">{omikujiResult.fortune}</h2>
        {/* 本文 */}
        <p className="w-full h-16 vertical text-sm mb-4">{omikujiResult.msg}</p>
        {/* 詳細リスト（スクロール可能領域） */}

        <div dir="rtl" className="grid grid-cols-5 gap-x-2 gap-y-4 text-xs">
          {omikujiResult.details.map((d) => (
            <div key={d.type} className="flex items-start h-54 w-12 text-left">
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
