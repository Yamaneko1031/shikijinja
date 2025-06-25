'use client';

import React from 'react';
import { Button } from '../_shared/Button';

type Props = {
  onClose: () => void;
};

export default function HelpIntroduction({ onClose }: Props) {
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
            <div className="w-full font-bold text-left mb-2">式岐神社について</div>
            <div className="w-full font-bold text-left mb-2">
              式岐神社は、IT業界で日々奮闘する皆さまのためのオンライン神社です。
              プロジェクト成功、バグ退散、アイデア閃き、納期厳守など、日々の業務に役立つご利益が満載。
              悩みや願いを神様に直接届ける「絵馬」、心強い味方となる「お守り」、運勢を楽しく占える「おみくじ」など、
              IT業界ならではのユニークなコンテンツを取り揃えております。
              式岐神社でひととき心を整え、新たな気持ちで業務に励みましょう。
            </div>
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
