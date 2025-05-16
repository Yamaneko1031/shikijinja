import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/_shared/Button';
import TextReveal from '@/components/_shared/TextReveal';
import { emaList } from '@/config/ema';
import { EmaImageKey } from '@/types/ema';

interface EmaFormHeaderProps {
  deityKey: EmaImageKey;
  setDeityKey: React.Dispatch<React.SetStateAction<EmaImageKey>>;
  prevKey: EmaImageKey;
  nextKey: EmaImageKey;
}

const EmaFormHeader: React.FC<EmaFormHeaderProps> = ({
  deityKey,
  setDeityKey,
  prevKey,
  nextKey,
}) => {
  return (
    <div className="relative flex flex-col items-center w-full">
      {/* 神様の説明 */}
      <div className="relative flex items-center gap-2 bg-white/20 rounded-sm p-2 h-[90px] w-full">
        <Button
          variant="subNatural"
          size="sm"
          onClick={() => setDeityKey(prevKey)}
          className="w-[30px] h-[30px] bg-white/10 hover:bg-white/20 text-white text-sm rounded-full"
        >
          ←
        </Button>
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <div className="w-[80px] h-[80px] rounded-md overflow-hidden">
            <Image
              src={`/images/illust/${emaList[deityKey].illustname}`}
              alt={emaList[deityKey].label}
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-white">【{emaList[deityKey].label}】</div>
            <div className="text-xs text-gray-300 ml-1 whitespace-pre-line text-center">
              {emaList[deityKey].grace}
            </div>
          </div>
        </div>
        <Button
          variant="subNatural"
          size="sm"
          onClick={() => setDeityKey(nextKey)}
          className="w-[30px] h-[30px] bg-white/10 hover:bg-white/20 text-white text-sm rounded-full"
        >
          →
        </Button>
      </div>
      {/* 説明文 */}
      <div className="relative w-full p-2">
        <TextReveal
          text={`自由に願い事を書いて投稿しよう。\nお祈りした神様から一言もらえるかもしません。`}
          delayPerChar={0.1}
          className="text-[14px]"
        />
      </div>
    </div>
  );
};

export default EmaFormHeader;
