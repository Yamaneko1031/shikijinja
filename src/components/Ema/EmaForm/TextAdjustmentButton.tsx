import React from 'react';
import Image from 'next/image';
import { Button } from '../../_shared/Button';

interface TextAdjustmentButtonProps {
  label: string;
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseIconPath: string;
  increaseIconPath: string;
}

export default function TextAdjustmentButton({
  label,
  onDecrease,
  onIncrease,
  decreaseIconPath,
  increaseIconPath,
}: TextAdjustmentButtonProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="underline underline-offset-2 text-[0.75rem]">{label}</span>
      <div className="flex items-center gap-2">
        <Button
          variant="subNatural"
          size="sm"
          onClick={onDecrease}
          className="px-2 py-1 bg-black rounded"
        >
          <Image
            src={decreaseIconPath}
            alt="Decrease"
            width={16}
            height={16}
            className="absolute"
          />
        </Button>
        <Button
          variant="subNatural"
          size="sm"
          onClick={onIncrease}
          className="px-2 py-1 bg-black rounded"
        >
          <Image
            src={increaseIconPath}
            alt="Increase"
            width={16}
            height={16}
            className="absolute"
          />
        </Button>
      </div>
    </div>
  );
}
