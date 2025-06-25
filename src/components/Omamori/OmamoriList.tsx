'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '../_shared/Button';
import { OmamoriBase } from '@/types/omamori';

type Props = {
  onClose: () => void;
  omamoriList: OmamoriBase[];
  isError: boolean;
  isLoading: boolean;
};

export default function OmamoriList({ onClose, omamoriList, isError, isLoading }: Props) {
  const [activeOmamori, setActiveOmamori] = useState<OmamoriBase | null>(null);
  useEffect(() => {
    if (isLoading) return;
    if (isError) return;
    setActiveOmamori(omamoriList[0]);
  }, [isLoading, isError, omamoriList]);

  const handleNextOmamori = () => {
    console.log('handleNextOmamori');
    if (!activeOmamori) return;
    // findの返り値が正しく次の要素を返していないため、indexを使って次の要素を直接取得するように修正
    const currentIndex = omamoriList.findIndex(
      (omamori: OmamoriBase) => omamori.name === activeOmamori.name
    );
    const nextIndex = (currentIndex + 1) % omamoriList.length;
    const nextOmamori = omamoriList[nextIndex];
    setActiveOmamori(nextOmamori);
  };

  const handlePrevOmamori = () => {
    if (!activeOmamori) return;
    const currentIndex = omamoriList.findIndex(
      (omamori: OmamoriBase) => omamori.name === activeOmamori.name
    );
    const prevIndex = (currentIndex - 1 + omamoriList.length) % omamoriList.length;
    const prevOmamori = omamoriList[prevIndex];
    setActiveOmamori(prevOmamori);
  };

  return (
    <div className="flex flex-col gap-4 items-center min-w-[20rem]">
      {isLoading && <div>読込み中...</div>}
      {isError && <div>お守りの読込みに失敗しました。</div>}
      {activeOmamori && (
        <>
          <div className="w-full text-2xl font-bold text-center">
            {activeOmamori.name}（{activeOmamori.hurigana}）
          </div>
          <div className="w-full flex flex-row gap-4 justify-center">
            <div className="min-w-[8.75rem] max-w-[12.5rem] flex justify-center items-center">
              <Image
                src={activeOmamori.imageUrl}
                alt={activeOmamori.name}
                width={200}
                height={300}
              />
            </div>
            <div className="max-w-[20rem] flex flex-col justify-items-start items-center gap-2">
              <div className="w-full text-md font-bold text-left">【基本説明】</div>
              <div className="w-full h-full text-sm text-left whitespace-pre-line">
                {activeOmamori.description}
              </div>
            </div>
          </div>
          <div className="w-full flex flex-row gap-4 justify-center">
            <Button
              variant="subNatural"
              size="md"
              disabled={!activeOmamori}
              onClick={handlePrevOmamori}
            >
              前へ
            </Button>
            <div className="w-12 text-md flex items-center justify-center">
              {omamoriList.findIndex((omamori) => omamori.name === activeOmamori?.name) + 1}/
              {omamoriList.length}
            </div>
            <Button
              variant="subNatural"
              size="md"
              disabled={!activeOmamori}
              onClick={handleNextOmamori}
            >
              次へ
            </Button>
          </div>
        </>
      )}
      <Button variant="negative" size="md" onClick={onClose}>
        閉じる
      </Button>
    </div>
  );
}
