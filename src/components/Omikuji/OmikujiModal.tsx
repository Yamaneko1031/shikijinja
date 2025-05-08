'use client';

import React from 'react';
import Image from 'next/image';
import { OmikujiResponse } from '@/types/omikuji';
import { Button } from '../shared/Button';
import { omikujiList } from '@/config/omikuji';

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
        <h2 className="w-full h-10 text-center text-2xl font-bold">
          おみくじ【{omikujiList[omikujiResponse.type as keyof typeof omikujiList].label}】
        </h2>
        {/* ヘッダー */}
        <div className="w-full h-14 mt-4 flex" style={{ color: '#D44439' }}>
          <div className="w-1/2 h-full text-2xl font-bold flex items-center justify-center">
            {new Date(omikujiResponse.createdAt).getFullYear()}年 運勢
          </div>
          <div className="w-1/2 h-full text-5xl font-bold flex items-center justify-center">
            {omikujiResponse.fortune}
          </div>
        </div>
        {/* 本文 */}
        <p className="w-full h-42 vertical font-otsutome text-left text-[16px] flex justify-center items-center mt-5">
          {omikujiResponse.msg}
        </p>
        {/* 詳細リスト（スクロール可能領域） */}
        <div dir="rtl" className="grid grid-cols-5 gap-x-3 gap-y-9 text-sm mt-7">
          {omikujiResponse.details.map((d) => (
            <div key={d.type} className="flex items-start h-45 w-12 text-left">
              <div className="font-otsutome vertical align-top">
                {d.type}【{d.rank}】
              </div>
              <div className="font-otsutome mt-4 vertical align-top">{d.element}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
