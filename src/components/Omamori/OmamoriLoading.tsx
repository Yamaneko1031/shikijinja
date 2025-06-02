import React from 'react';
import Image from 'next/image';
import { OmamoriData } from '@/types/omamori';

interface Props {
  omamoriData: OmamoriData | null;
}

const OmamoriLoading: React.FC<Props> = (props: Props) => {
  console.log('OmamoriLoading');
  return (
    <div className="relative w-full h-[19rem] bg-[url('/images/bg_hude/bg_washi.webp')] bg-[length:100%_100%]">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[19rem] text-left text-black text-2xl font-bold omikuji-lot">
        効能付与中
      </div>
      <div className="absolute bottom-2 left-2 omikuji-inori" aria-hidden="true"></div>
      <Image
        src={props.omamoriData?.imageUrl || ''}
        alt="omikuji_box"
        width={128}
        height={128}
        className="absolute bottom-20 right-1/10 object-contain animate-omamori-shuffle w-[7rem] h-[7rem]"
        aria-hidden="true"
      />
    </div>
  );
};

export default OmamoriLoading;
