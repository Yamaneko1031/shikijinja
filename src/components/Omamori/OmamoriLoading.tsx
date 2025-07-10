import React from 'react';
import Image from 'next/image';
import { OmamoriDataResponse, OmamoriLoadingState } from '@/types/omamori';
import OmamoriShuffle from './OmamoriShuffle';

interface Props {
  omamoriData: OmamoriDataResponse | null;
  loadingState: OmamoriLoadingState;
}

const OmamoriLoading: React.FC<Props> = (props: Props) => {
  let loadingMessage = '';
  let stopNumber = 0;

  switch (props.loadingState) {
    case 'shuffle':
      loadingMessage = 'お守りを選択中';
      break;
    case 'stop':
      loadingMessage = 'お守りを選択中';
      stopNumber = Number(props.omamoriData?.baseId) - 1;
      break;
    case 'fortune':
      loadingMessage = '効能を付与中';
      break;
  }

  return (
    <div className="relative w-full h-[19rem] bg-[url('/images/bg_hude/bg_washi.webp')] bg-[length:100%_100%]">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[19rem] text-left text-black text-2xl font-bold omikuji-lot">
        {loadingMessage}
      </div>

      {props.loadingState !== 'none' && props.loadingState !== 'fortune' && (
        <>
          <Image
            src="/images/omamori/neko_nayami.webp"
            alt="neko_nayami"
            width={128}
            height={128}
            className="absolute bottom-0 left-4 w-[14rem] h-[14rem]"
          />
          <div className="absolute bottom-12 right-12">
            <OmamoriShuffle stopNumber={stopNumber} loadingState={props.loadingState} />
          </div>
        </>
      )}

      {props.loadingState === 'fortune' && props.omamoriData && (
        <>
          <div className="absolute bottom-2 left-2 omikuji-inori" aria-hidden="true"></div>
          <Image
            src={props.omamoriData.imageUrl}
            alt="omamori_box"
            width={128}
            height={128}
            className="absolute bottom-20 right-1/10 object-contain animate-omamori-shuffle w-[8rem] h-[8rem]"
            aria-hidden="true"
          />
        </>
      )}
    </div>
  );
};

export default React.memo(OmamoriLoading);
