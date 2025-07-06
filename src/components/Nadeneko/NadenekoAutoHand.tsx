'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

type Props = {
  isAuto: boolean;
  nadenekoAreaRef: React.RefObject<HTMLDivElement>;
  petUpdate: (x: number, y: number) => void;
};

export default function NadenekoAutoHand({ isAuto, nadenekoAreaRef, petUpdate }: Props) {
  const [handPosition, setHandPosition] = useState({ x: 0, y: 0, frame: 0 });
  // 自動モードの更新処理
  useEffect(() => {
    const autoUpdate = () => {
      if (isAuto) {
        const nadenekoArea = nadenekoAreaRef.current?.getBoundingClientRect();
        if (nadenekoArea) {
          const baseRateX = nadenekoArea.width / 10;
          const baseRateY = nadenekoArea.height / 40;
          setHandPosition((prev) => {
            const x = Math.sin(prev.frame * 0.02) - 0.3;
            const y = x * x;
            return {
              x: nadenekoArea.width / 2 + x * baseRateX,
              y: nadenekoArea.height / 3 + y * baseRateY,
              frame: prev.frame + 1,
            };
          });
        }
      }
      requestAnimationFrame(autoUpdate);
    };
    autoUpdate();
    requestAnimationFrame(autoUpdate);
  }, [isAuto, petUpdate, nadenekoAreaRef]);

  petUpdate(handPosition.x, handPosition.y);

  return (
    <div className="select-none">
      <div
        className="absolute"
        style={{
          left: `${handPosition.x}px`,
          top: `${handPosition.y}px`,
        }}
      >
        <Image
          src="/images/icon/icon_hand.webp"
          alt="手"
          width={100}
          height={100}
          className="w-[3rem] h-[3rem] animate-nadeneko-hand"
        />
      </div>
    </div>
  );
}
