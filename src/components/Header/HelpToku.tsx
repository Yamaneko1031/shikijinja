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
        <ul className="help-ul">
          <li>
            <h3>徳コインとは</h3>
            <p>
              徳コインとは式岐神社で利用できる通貨です。
              <br />
              おみくじやお守りの購入、賽銭を投げる際に必要になります。
              <br />
              特定の行動を行う事で貯まっていきます。
            </p>
          </li>
          <li>
            <h3>徳の貯まる行動</h3>
            <ul>
              <li>
                <p>鳥居をくぐる（1日1回）</p>
              </li>
              <li>
                <p>絵馬を書く（1日1回）</p>
              </li>
              <li>
                <p>絵馬をタップする（1日5回）</p>
              </li>
              <li>
                <p>なで猫をなでる（1日1回）</p>
              </li>
              <li>
                <p>アカウント登録をする（初回のみ）</p>
              </li>
              <li>
                <p>神様紹介を見る（初回のみ）</p>
              </li>
              <li>
                <p>十戒を見る（初回のみ）</p>
              </li>
              <li>
                <p>おまもりの結果をシェアする（初回のみ）</p>
              </li>
              <li>
                <p>おみくじの結果をシェアする（初回のみ）</p>
              </li>
            </ul>
          </li>
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
