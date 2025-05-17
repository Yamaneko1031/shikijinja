import React from 'react';
import Image from 'next/image';

const OmikujiLoding: React.FC = () => {
  console.log('OmikujiLoding');
  return (
    <div className="relative mx-2 min-w-[340px] w-[440px] h-[300px] bg-[url('/images/bg_hude/bg_washi.webp')] bg-[length:100%_100%]">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[240px] text-left text-black text-2xl font-bold omikuji-lot">
        おみくじ抽選中
      </div>
      <div className="absolute bottom-2 left-2 omikuji-inori" aria-hidden="true"></div>
      <Image
        src="/images/omikuji/omikuji_box.webp"
        alt="omikuji_box"
        width={128}
        height={128}
        className="absolute bottom-30 right-5 object-contain animate-omikuji-shuffle"
        aria-hidden="true"
      />
    </div>
  );
};

export default OmikujiLoding;
