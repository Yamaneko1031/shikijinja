'use client';

import React from 'react';
import { Button } from '../_shared/Button';

type Props = {
  onClose: () => void;
};

export default function HelpPolicy({ onClose }: Props) {
  return (
    <div className="select-none">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-[30rem]">
          <div className="relative w-full flex flex-col p-4 bg-white rounded-md text-black">
            {/* <div
              className="relative w-full aspect-square flex flex-col bg-[length:100%_100%]"
              style={{
                backgroundImage: `url('/images/illust/${shoukaiData.illustname}')`,
              }}
            ></div> */}
            <div className="w-full font-bold text-left mb-2">プライバシーポリシー</div>
            <div className="w-full font-bold text-left mb-2"></div>
            <Button variant="negative" size="md" onClick={onClose} aria-label="閉じる">
              閉じる
            </Button>
          </div>
        </div>
      </div>
      {/* <div className="fixed w-full bottom-6 m-auto flex flex-row justify-center gap-2">
        <Button variant="negative" size="md" onClick={onClose} aria-label="閉じる">
          閉じる
        </Button>
      </div> */}
    </div>
  );
}
