'use client';

import React from 'react';
import { OmikujiResponse, OmikujiType } from '@/types/omikuji';
import { Button } from '../_shared/Button';
import OmikujiSeat from './OmikujiSeat';

type Props = {
  omikujiResponse: OmikujiResponse;
  omikujiType: OmikujiType;
  onClose: () => void;
};

export default function OmikujiModal({ omikujiResponse, omikujiType, onClose }: Props) {
  return (
    // 半透明のオーバーレイ
    <div className="min-h-[100lvh] flex flex-col items-center justify-center">
      <div className="mt-5 mb-10">
        <OmikujiSeat omikujiResponse={omikujiResponse} omikujiType={omikujiType} />
      </div>
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
    </div>
  );
}
