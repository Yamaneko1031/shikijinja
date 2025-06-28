'use client';

import React from 'react';
import { Button } from '../_shared/Button';

type Props = {
  onClose: () => void;
};

export default function HelpToku({ onClose }: Props) {
  return (
    <div className="w-full h-full flex flex-col items-center text-black">
      <div className="min-h-[3rem] flex justify-center items-center">徳コインについて</div>
      <div className="max-h-[60vh] w-full overflow-scroll m-1 p-2 border-2 border-gray-100">
        徳コインとは式岐神社で利用できる通貨です。
        <br />
        おみくじやお守りの購入、賽銭を投げる際に必要になります。
        <br />
        特定の行動を行う事で貯まっていきます。
        <br />
        <br />
        ■徳の貯まる行動
        <ul>
          <li>・鳥居をくぐる（1日1回）</li>
          <li>・絵馬を書く（1日1回）</li>
          <li>・絵馬をタップする（1日5回）</li>
          <li>・なで猫をなでる（1日1回）</li>
          <li>・アカウント登録をする（初回のみ）</li>
          <li>・神様紹介を見る（初回のみ）</li>
          <li>・十戒を見る（初回のみ）</li>
        </ul>
      </div>
      <div className="min-h-[3rem] flex justify-center items-center">
        <Button variant="negative" size="md" onClick={onClose} aria-label="閉じる">
          閉じる
        </Button>
      </div>
    </div>
  );
}
