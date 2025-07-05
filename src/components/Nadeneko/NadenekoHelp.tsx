'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '../_shared/Button';
type Props = {
  handleClose: () => void;
};

export default function NadenekoHelp({ handleClose }: Props) {
  return (
    <div className="w-full h-full flex flex-col items-center text-black">
      <div className="min-h-[3rem] flex justify-center items-center">遊び方</div>
      <div className="max-h-[60vh] w-full overflow-scroll m-1 p-2 border-2 border-gray-100">
        <ul className="help-ul">
          <li>
            <h3>猫をなでよう</h3>
            <p>猫の像を指でなでなで（ドラッグ）すると「徳」が貯まります。</p>
            <div className="flex flex-col items-center">
              <Image
                src="/images/nadeneko/nadeneko_help1.webp"
                alt="nadeneko_help1"
                width={300}
                height={300}
              />
            </div>
          </li>
          <li>
            <h3>猫が満足したら終わり</h3>
            <p>
              なでなでが続くと、突然「満足にゃ！」といって終わり。…え、もう終わり！？なんて言わないで。
            </p>
            <div className="flex flex-col items-center">
              <Image
                src="/images/nadeneko/nadeneko_help2.webp"
                alt="nadeneko_help2"
                width={300}
                height={300}
              />
            </div>
          </li>
          <li>
            <h3>全自動なでなで機能</h3>
            <p>【おまかせ】ボタンを押せば、あとは自動でOK。</p>
            <p>あなたの指はもう休んで大丈夫です。</p>
          </li>
        </ul>
      </div>
      <div className="min-h-[3rem] flex justify-center items-center">
        <Button variant="negative" size="md" onClick={handleClose} aria-label="閉じる">
          閉じる
        </Button>
      </div>
    </div>
  );
}
