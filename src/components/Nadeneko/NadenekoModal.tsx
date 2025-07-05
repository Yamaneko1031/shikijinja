'use client';

import React, { useState } from 'react';
import { Button } from '../_shared/Button';
import NadenekoSeat from './NadenekoSeat';
import { NadenekoResponse } from '@/types/nadeneko';
import NadenekoResult from './NadenekoResult';
import { TokuId } from '@/types/toku';
type Props = {
  lotData: NadenekoResponse | null;
  onClose: () => void;
  handleAddCoin: (coin: number) => void;
  handleTokuGet: (tokuId: TokuId) => void;
  handleIsLimitOver: (tokuId: TokuId) => boolean;
};

export default function NadenekoModal({
  lotData,
  onClose,
  handleAddCoin,
  handleTokuGet,
  handleIsLimitOver,
}: Props) {
  const [isFinished, setIsFinished] = useState(false);

  const handleFinished = () => {
    setIsFinished(true);
  };

  const handleClose = () => {
    if (lotData) {
      onClose();
      handleAddCoin(lotData.totalAddCoin);
    }
  };

  return (
    <div className="select-none">
      {isFinished === false ? (
        <div className="min-h-[100lvh] flex flex-col items-center">
          <div className="m-auto">
            <NadenekoSeat
              lotData={lotData}
              handleFinished={handleFinished}
              handleTokuGet={handleTokuGet}
              handleIsLimitOver={handleIsLimitOver}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="min-h-[100lvh] flex flex-col items-center">
            <div className="m-auto">{lotData && <NadenekoResult lotData={lotData} />}</div>
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
