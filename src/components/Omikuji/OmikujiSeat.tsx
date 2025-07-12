import React from 'react';
import Image from 'next/image';
import { OmikujiResponse, OmikujiType } from '@/types/omikuji';
import { omikujiConfig, omikujiMonthList } from '@/config/omikuji';

type Props = {
  omikujiResponse: OmikujiResponse;
};

export default function OmikujiSeat({ omikujiResponse }: Props) {
  const omikujiName = omikujiConfig[omikujiResponse.type as OmikujiType].name;
  const omikujiImage = omikujiConfig[omikujiResponse.type as OmikujiType].image;
  return (
    // 半透明のオーバーレイ
    <div
      className="relative w-[25rem] min-w-[25rem] h-[50rem] min-h-[50rem] flex items-center justify-center bg-[length:100%]"
      style={{ backgroundImage: `url(${omikujiImage})` }}
    >
      <div className="relative w-[25rem] -mt-10 pt-4 pl-12 pr-12 text-black/80 flex flex-col">
        {/* おみくじ名 */}
        <h2 className="w-full h-10 text-center text-3xl font-bold">{omikujiName}</h2>
        {/* 運勢表示 */}
        <div className="w-full h-14 mt-4 flex" style={{ color: '#D44439' }}>
          <div className="w-1/2 h-full text-2xl font-bold flex items-center justify-center">
            {(() => {
              switch (omikujiResponse.type) {
                case 'omikuji':
                  return `${new Date(omikujiResponse.createdAt).getFullYear()}年 運勢`;
                case 'hitohira':
                  return `${omikujiMonthList[new Date(omikujiResponse.createdAt).getMonth()]}`;
                case 'nekobiyori':
                  return (
                    <div className="w-20">
                      <Image
                        src={`/images/omikuji/neko_stamp${omikujiResponse.fortuneNumber}.webp`}
                        alt="neko_stamp"
                        width={256}
                        height={160}
                      />
                    </div>
                  );
                default:
                  return '';
              }
            })()}
          </div>
          <div className="w-1/2 h-full text-5xl font-bold flex items-center justify-center">
            {omikujiResponse.fortune}
          </div>
        </div>
        {/* 本文 */}
        <p
          className={`w-full h-42 vertical font-otsutome text-left flex justify-center items-center mt-5 ${
            omikujiResponse.msg.length > 130 ? 'text-sm' : 'text-[1rem]'
          }`}
        >
          {omikujiResponse.msg}
        </p>
        {/* 詳細リスト */}
        <div className="grid grid-cols-5 gap-x-1 gap-y-9 text-sm mt-7">
          {/* grid内を右上から配置したいので、配列をソートしてから表示 */}
          {[...omikujiResponse.details]
            .sort((a, b) => {
              const order = [4, 3, 2, 1, 0, 9, 8, 7, 6, 5];
              return (
                order.indexOf(omikujiResponse.details.indexOf(a)) -
                order.indexOf(omikujiResponse.details.indexOf(b))
              );
            })
            .map((d) => (
              <div key={d.type} className="flex justify-start items-start h-45 text-left">
                <div className="font-otsutome w-[2.5rem] mt-4 vertical align-top">{d.element}</div>
                <div
                  className={`font-otsutome vertical align-top ${
                    d.type.length > 10 ? 'text-[0.75rem]' : ''
                  }`}
                >
                  {d.type}★{d.rank}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
