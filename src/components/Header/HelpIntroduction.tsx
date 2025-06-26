'use client';

import React from 'react';
import { Button } from '../_shared/Button';

type Props = {
  onClose: () => void;
};

export default function HelpIntroduction({ onClose }: Props) {
  return (
    <div className="w-full h-full flex flex-col items-center text-black">
      <div className="min-h-[3rem] flex justify-center items-center">式岐神社について</div>
      <div className="max-h-[60vh] overflow-scroll m-1 p-2 border-2 border-gray-100">
        式岐神社は、IT業界で日々奮闘する皆さまのためのオンライン神社です。
        <br />
        プロジェクト成功、バグ退散、アイデア閃き、納期厳守など、日々の業務に役立つご利益が満載。
        <br />
        悩みや願いを神様に直接届ける「絵馬」、心強い味方となる「お守り」、運勢を楽しく占える「おみくじ」など、
        IT業界ならではのユニークなコンテンツを取り揃えております。
        <br />
        式岐神社でひととき心を整え、新たな気持ちで業務に励みましょう。
      </div>
      <div className="min-h-[3rem] flex justify-center items-center">
        <Button variant="negative" size="md" onClick={onClose} aria-label="閉じる">
          閉じる
        </Button>
      </div>
    </div>
  );
}
