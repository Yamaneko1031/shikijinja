'use client';

import React from 'react';
import { Button } from '../_shared/Button';

type Props = {
  onClose: () => void;
};

export default function HelpToku({ onClose }: Props) {
  return (
    <div className="select-none">
      <div className="min-h-[100lvh] pt-5 flex flex-col items-center">
        <div className="pl-4 pr-4 pt-5 pb-20 w-full max-w-[30rem]">
          <div className="relative w-full flex flex-col p-4 bg-white rounded-md text-black">
            {/* <div
              className="relative w-full aspect-square flex flex-col bg-[length:100%_100%]"
              style={{
                backgroundImage: `url('/images/illust/${shoukaiData.illustname}')`,
              }}
            ></div> */}
            <div className="w-full font-bold text-left mb-2">徳コインについて</div>
            <div className="w-full font-bold text-left mb-2"></div>
          </div>
        </div>
      </div>
      <div className="fixed w-full bottom-6 m-auto flex flex-row justify-center gap-2">
        {/* 閉じるボタン */}

        <Button variant="negative" size="md" onClick={onClose} aria-label="閉じる">
          閉じる
        </Button>
      </div>
    </div>
  );
}
