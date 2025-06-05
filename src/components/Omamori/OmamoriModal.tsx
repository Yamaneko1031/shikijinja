'use client';

import React from 'react';
import { Button } from '../_shared/Button';
import { OmamoriDataResponse } from '@/types/omamori';
import OmamoriSeat from './OmamoriSeat';

type Props = {
  omamoriData: OmamoriDataResponse;
  onClose: () => void;
};

export default function OmamoriModal({ omamoriData, onClose }: Props) {
  return (
    <div className="min-h-[100lvh] flex flex-col items-center justify-center">
      <div className="mt-5 mb-10">
        <OmamoriSeat omamoriData={omamoriData} />
      </div>
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
