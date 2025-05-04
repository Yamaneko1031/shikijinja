'use client';

import React from 'react';
import Image from 'next/image';
import { OmikujiResult } from '@/types/omikuji';
type Props = {
  omikujiResult: OmikujiResult;
  onClose: () => void;
};

export default function OmikujiModal({ omikujiResult, onClose }: Props) {
  return (
    // 半透明のオーバーレイ
    <div className="relative w-[400px] h-[800px] flex items-center justify-center">
      {/* 紙テクスチャのウィンドウ */}
      <Image
        className="absolute"
        src="/images/omikuji/omikuji.png"
        alt="おみくじ"
        width={400}
        height={800}
      />
      <div className="relative z-10 text-black">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          aria-label="閉じる"
        >
          閉じる
        </button>
        <div className="relative p-12">
          {/* ヘッダー */}
          <h2 className="w-full h-10 text-center text-2xl font-bold">{omikujiResult.fortune}</h2>
          {/* 本文 */}
          <p className="w-full h-30 vertical text-sm mb-4">{omikujiResult.msg}</p>
          {/* 詳細リスト（スクロール可能領域） */}
          <div className="pr-2">
            <div className="grid grid-cols-5 gap-2 text-xs">
              {omikujiResult.details.map((d) => (
                <div key={d.type} className="p-2 flex flex-col items-end">
                  <div className="vertical h-10 font-semibold">{d.type}</div>
                  <div className="my-1">{'★'.repeat(d.rank).padEnd(5, '☆')}</div>
                  <div className="vertical h-30">{d.element}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
