'use client';

import React from 'react';
import TextReveal from '@/components/_shared/TextReveal';
import { SectionProps } from '@/types/section';
import Image from 'next/image';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OmamoriSection = (props: SectionProps) => {
  // const [selectedOmamori, setSelectedOmamori] = useState('love');

  // const handlePurchase = () => {
  //   // 購入処理（例えば、APIに購入リクエストを送る）
  //   alert('御守りを受け取りました！');
  // };

  return (
    <>
      <div className="relative max-w-2xl min-w-[320px] top-[600px] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <div className="relative h-full w-full bg-black/50 rounded-lg flex flex-col gap-2 pt-4 pl-4 pb-4 pr-[180px]">
          <div className="">
            <TextReveal
              text="お守りがあるにゃ！"
              delayPerChar={0.1}
              className="text-xl md:text-2xl font-bold"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-[200px]">
            <Image
              src="/images/omamori/neko_omamori.webp"
              alt="neko_omamori"
              width={400}
              height={300}
            />
          </div>
        </div>
        <div className="relative h-full w-full bg-black/50 rounded-lg flex flex-row gap-2 p-4"></div>
      </div>
      {/* 
      <div className="relative top-[600px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] p-10 bg-black/50 rounded-lg">
        <TextReveal
          text="ご利益を得たい御守りを選択して受け取るコンテンツ"
          delayPerChar={0.1}
          className="text-2xl font-bold mb-4"
        />
        <select
          className="p-2 mb-4"
          value={selectedOmamori}
          onChange={(e) => setSelectedOmamori(e.target.value)}
        >
          <option value="project">プロジェクト運</option>
          <option value="health">健康運</option>
          <option value="money">金運</option>
        </select>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded" onClick={handlePurchase}>
          受け取る
        </button>
      </div> */}
    </>
  );
};

export default React.memo(OmamoriSection);
