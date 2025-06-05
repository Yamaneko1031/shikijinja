'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '../_shared/Button';
import { OmamoriBase } from '@/types/omamori';
import { apiFetch } from '@/lib/api';
type Props = {
  onClose: () => void;
};

export default function OmamoriList({ onClose }: Props) {
  const [activeOmamori, setActiveOmamori] = useState<OmamoriBase | null>(null);
  const omamoriListRef = useRef<OmamoriBase[]>([]);

  useEffect(() => {
    const handleGetOmamoriList = async () => {
      const res = await apiFetch<OmamoriBase[]>('/api/omamori/master', {
        method: 'GET',
      });
      omamoriListRef.current = res;
      setActiveOmamori(omamoriListRef.current[0]);
    };
    handleGetOmamoriList();
  }, []);

  const handleNextOmamori = () => {
    console.log('handleNextOmamori');
    if (!activeOmamori) return;
    // findの返り値が正しく次の要素を返していないため、indexを使って次の要素を直接取得するように修正
    const currentIndex = omamoriListRef.current.findIndex(
      (omamori: OmamoriBase) => omamori.name === activeOmamori.name
    );
    const nextIndex = (currentIndex + 1) % omamoriListRef.current.length;
    const nextOmamori = omamoriListRef.current[nextIndex];
    setActiveOmamori(nextOmamori);
  };

  const handlePrevOmamori = () => {
    if (!activeOmamori) return;
    const currentIndex = omamoriListRef.current.findIndex(
      (omamori: OmamoriBase) => omamori.name === activeOmamori.name
    );
    const prevIndex =
      (currentIndex - 1 + omamoriListRef.current.length) % omamoriListRef.current.length;
    const prevOmamori = omamoriListRef.current[prevIndex];
    setActiveOmamori(prevOmamori);
  };

  return (
    <div className="flex flex-col gap-4 items-center min-w-[20rem]">
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
              {omamoriListRef.current.findIndex((omamori) => omamori.name === activeOmamori?.name) +
                1}
              /{omamoriListRef.current.length}
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
