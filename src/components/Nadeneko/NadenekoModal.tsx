'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../_shared/Button';
import NadenekoSeat from './NadenekoSeat';
import { NadenekoResponse } from '@/types/nadeneko';
import NadenekoResult from './NadenekoResult';

type Props = {
  lotData: NadenekoResponse;
  onClose: () => void;
  handleAddCoin: (coin: number) => void;
};

export default function NadenekoModal({ lotData, onClose, handleAddCoin }: Props) {
  const [isFinished, setIsFinished] = useState(false);
  const loadedImages = useRef<HTMLImageElement[]>([]);

  const handleFinished = () => {
    setIsFinished(true);
  };

  const handleClose = () => {
    onClose();
    handleAddCoin(lotData.totalAddCoin);
  };

  // 先読込み
  useEffect(() => {
    const images = [
      '/images/nadeneko/nadeneko_result.png',
      '/images/nadeneko/neko_action.png',
      '/images/icon/icon_coin_nadeneko.png',
    ];
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      loadedImages.current.push(img);
    });
  }, []);

  return (
    <div className="select-none">
      {isFinished === false ? (
        <div className="min-h-[100lvh] flex flex-col items-center">
          <div className="m-auto">
            <NadenekoSeat lotData={lotData} handleFinished={handleFinished} />
          </div>
        </div>
      ) : (
        <>
          <div className="min-h-[100lvh] flex flex-col items-center">
            <div className="m-auto">
              <NadenekoResult lotData={lotData} />
            </div>
          </div>
          <div className="fixed w-full bottom-6 m-auto flex flex-row justify-center gap-2">
            {/* 閉じるボタン */}
            <Button variant="negative" size="md" onClick={handleClose} aria-label="閉じる">
              閉じる
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
