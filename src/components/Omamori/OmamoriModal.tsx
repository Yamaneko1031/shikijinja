'use client';

import React, { useState } from 'react';
import { Button } from '../_shared/Button';
import { OmamoriDataResponse } from '@/types/omamori';
import OmamoriSeat from './OmamoriSeat';
import Image from 'next/image';
import { shareX } from '@/lib/shareX';
import { TokuId } from '@/types/toku';
import { getTokuCoin } from '@/utils/toku';

type Props = {
  omamoriData: OmamoriDataResponse;
  onClose: () => void;
  handleIsLimitOver: (tokuId: TokuId) => boolean;
  handleTokuGet: (tokuId: TokuId) => void;
};

export default function OmamoriModal({
  omamoriData,
  onClose,
  handleIsLimitOver,
  handleTokuGet,
}: Props) {
  const [rate, setRate] = useState(1);

  const handleShareX = async () => {
    if (!handleIsLimitOver('omamori_share')) {
      handleTokuGet('omamori_share');
    }
    const shareUrl = `${window.location.origin}/omamori/${omamoriData.id}`;
    let headText = '式岐神社でおまもりを貰ったよ！\n';
    headText += `\n【${omamoriData.name}】`;

    // メッセージを短く調整（文字数制限対策）
    let shortMsg = '';
    omamoriData.fortunes.map((fortune) => {
      shortMsg += `${fortune.name}:+${fortune.power}\n`;
    });

    shortMsg += '\n【詳細】';
    const shareText = `${headText}\n${shortMsg}`;
    const hashtags = '式岐神社';
    shareX(shareText, shareUrl, hashtags);
  };

  let transformOrigin = `left top`;
  if (rate < 1) {
    transformOrigin = `center center`;
  }
  return (
    <div className="select-none">
      <div className="min-h-[100lvh] pt-5 flex flex-col items-center">
        <div
          className="m-auto pb-20 "
          style={{
            transform: `scale(${rate})`,
            transformOrigin: transformOrigin,
          }}
        >
          <OmamoriSeat omamoriData={omamoriData} />
        </div>
      </div>
      <div className="fixed w-full bottom-6 m-auto flex flex-row justify-center gap-2">
        {/* 閉じるボタン */}

        <Button variant="negative" size="md" onClick={onClose} aria-label="閉じる">
          閉じる
        </Button>
        <Button
          variant="custom"
          size="custom"
          className="btn-share pl-2 pr-3 border-1 border-gray-200 hover:bg-gray-100 rounded-full flex flex-row items-center gap-1"
          onClick={() => handleShareX()}
        >
          <div className="w-8 h-8 p-2 bg-black rounded-full flex items-center justify-center">
            <Image
              src="/images/icon/icon_x.svg"
              alt="x_icon"
              width={24}
              height={24}
              className="h-full w-auto"
            />
          </div>
          <div className="flex flex-col items-center">
            {!handleIsLimitOver('omamori_share') ? (
              <>
                <div className="text-xs text-white font-bold">結果をポスト</div>
                <div className="flex flex-row items-center">
                  <Image
                    src="/images/icon/icon_coin.webp"
                    alt="omamori_button"
                    width={24}
                    height={24}
                  />
                  <div className="text-xs text-yellow-400 font-bold">
                    {getTokuCoin('omamori_share')}獲得（初回）
                  </div>
                </div>
              </>
            ) : (
              <div className="text-sm text-white font-bold">結果をポスト</div>
            )}
          </div>
        </Button>
        <Button
          variant="subNatural"
          size="md"
          onClick={() => setRate(rate - 0.05)}
          aria-label="縮小"
          disabled={rate <= 0.75}
        >
          <Image src="/images/icon/icon_glass_minus.svg" alt="縮小" width={24} height={24} />
        </Button>
        <Button
          variant="subNatural"
          size="md"
          onClick={() => setRate(rate + 0.05)}
          aria-label="拡大"
          disabled={rate >= 1.25}
        >
          <Image src="/images/icon/icon_glass_plus.svg" alt="拡大" width={24} height={24} />
        </Button>
      </div>
    </div>
  );
}
