'use client';

import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
import { Button } from '../_shared/Button';
import { OmamoriBase } from '@/types/omamori';
import { UserItems } from '@/types/user';

type Props = {
  onClose: () => void;
  omamoriList: OmamoriBase[];
  isError: boolean;
  isLoading: boolean;
  userItems: UserItems | undefined;
};

export default function OmamoriList({
  onClose,
  omamoriList,
  isError,
  isLoading,
  userItems,
}: Props) {
  const [activeOmamori, setActiveOmamori] = useState<OmamoriBase | null>(null);
  const [omamoriIndex, setOmamoriIndex] = useState<number>(0);

  const isAlready = userItems?.omamori.find((omamori) => omamori.name === activeOmamori?.name);

  useEffect(() => {
    if (isLoading) return;
    if (isError) return;
    setActiveOmamori(omamoriList[0]);
    setOmamoriIndex(0);
  }, [isLoading, isError, omamoriList]);

  const handleNextOmamori = () => {
    console.log('handleNextOmamori');
    if (!activeOmamori) return;
    const nextIndex = (omamoriIndex + 1) % omamoriList.length;
    setOmamoriIndex(nextIndex);
    setActiveOmamori(omamoriList[nextIndex]);
  };

  const handlePrevOmamori = () => {
    if (!activeOmamori) return;
    const prevIndex = (omamoriIndex - 1 + omamoriList.length) % omamoriList.length;
    setOmamoriIndex(prevIndex);
    setActiveOmamori(omamoriList[prevIndex]);
  };

  return (
    <div className="flex flex-col gap-4 items-center p-2">
      {isLoading && <div>読込み中...</div>}
      {isError && <div>お守りの読込みに失敗しました。</div>}
      {activeOmamori && (
        <>
          <div className="absolute top-14 left-2">
            {isAlready ? (
              <div className="relative text-xs">所持</div>
            ) : (
              <div className="relative text-xs text-red-400">未所持</div>
            )}
          </div>

          <div className="w-full text-xl font-bold text-center">
            {activeOmamori.name}（{activeOmamori.hurigana}）
          </div>
          <div className="w-full border-t border-gray-200"></div>
          <div className="w-full flex flex-row gap-4 justify-center">
            <div
              className="min-w-[8rem] h-[12rem]"
              style={{
                backgroundImage: 'url("/images/omamori/omamori_all.webp")',
                backgroundPositionX: `-${omamoriIndex * 8}rem`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'auto 100%',
                transform: 'rotate(8deg)',
              }}
            ></div>
            <div className="max-w-[20rem] flex flex-col justify-items-start items-center gap-2">
              <div className="w-full text-md font-bold text-left">【基本説明】</div>
              <div className="w-full h-full text-sm text-left whitespace-pre-line">
                {activeOmamori.description}
              </div>
            </div>
          </div>
          <div className="w-full border-t border-gray-200"></div>
          <div className="w-full flex flex-row gap-4 justify-center">
            <Button
              variant="subNatural"
              size="sm"
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
              size="sm"
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
