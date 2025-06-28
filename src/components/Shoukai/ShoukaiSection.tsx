'use client';

import React, { useState } from 'react';
import TextReveal from '@/components/_shared/TextReveal';
import { SectionProps } from '@/types/section';
import Modal from '../_shared/Modal';
import ShoukaiModal from './ShoukaiModal';
import { Button } from '../_shared/Button';
import Image from 'next/image';
import DecalogueModal from './DecalogueModal';
import { getTokuCoin } from '@/utils/toku';
const ShoukaiSection = (props: SectionProps) => {
  console.log('ShoukaiSection', props.isActive, props.isNeighbor);

  const [shoukaiModalOpen, setShoukaiModalOpen] = useState(false);
  const [decalogueModalOpen, setDecalogueModalOpen] = useState(false);

  const handleShoukaiModalClose = () => {
    if (!props.handleIsLimitOver('shoukai')) {
      props.handleTokuGet('shoukai');
    }
    setShoukaiModalOpen(false);
  };

  const handleDecalogueModalClose = () => {
    if (!props.handleIsLimitOver('jikkai')) {
      props.handleTokuGet('jikkai');
    }
    setDecalogueModalOpen(false);
  };

  return (
    <>
      <div className="relative max-w-2xl min-w-[20rem] top-[37.5rem] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <div className="relative h-full w-full bg-black/50 rounded-lg flex flex-col gap-2 pt-4 pl-4 pb-4 pr-[11.25rem]">
          <div className="">
            <TextReveal
              text="資料があるにゃ！"
              delayPerChar={0.1}
              className="text-xl md:text-2xl font-bold"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-[12.5rem]">
            <Image
              src="/images/shoukai/neko_shoukai.webp"
              alt="neko_omamori"
              width={400}
              height={300}
            />
          </div>
        </div>

        <div className="relative w-full bg-black/50 rounded-lg flex flex-col items-center gap-2 p-4">
          <div className="w-full text-xl flex flex-col gap-4 items-start">
            式岐神社に祭られている神様の文献が置かれています。
          </div>
          <Button
            variant="positive"
            size="lg"
            onClick={() => setShoukaiModalOpen(true)}
            className="w-full max-w-md flex flex-col pt-2 pb-2"
          >
            <div className="text-xl font-bold">神様の紹介を見る</div>
            {!props.handleIsLimitOver('shoukai') && (
              <div className="flex flex-row items-center">
                <Image
                  src="/images/icon/icon_coin.webp"
                  alt="omikuji_button"
                  width={24}
                  height={24}
                />
                <div className="text-sm text-yellow-400 font-bold">
                  {getTokuCoin('shoukai')}獲得（初回）
                </div>
              </div>
            )}
          </Button>
          <Button
            variant="positive"
            size="lg"
            onClick={() => setDecalogueModalOpen(true)}
            className="w-full max-w-md flex flex-col pt-2 pb-2"
          >
            <div className="text-xl font-bold">十戒を見る</div>
            {!props.handleIsLimitOver('jikkai') && (
              <div className="flex flex-row items-center">
                <Image
                  src="/images/icon/icon_coin.webp"
                  alt="omikuji_button"
                  width={24}
                  height={24}
                />
                <div className="text-sm text-yellow-400 font-bold">
                  {getTokuCoin('jikkai')}獲得（初回）
                </div>
              </div>
            )}
          </Button>
        </div>
      </div>

      <Modal
        isOpen={shoukaiModalOpen}
        className="absolute top-0 left-0 min-h-[100lvh] min-w-[100vw] bg-transparent overscroll-contain"
      >
        <ShoukaiModal shoukaiIndex={0} onClose={handleShoukaiModalClose} />
      </Modal>

      <Modal
        isOpen={decalogueModalOpen}
        className="absolute top-0 left-0 min-h-[100lvh] min-w-[100vw] bg-transparent overscroll-contain"
      >
        <DecalogueModal onClose={handleDecalogueModalClose} />
      </Modal>
    </>
  );
};

export default React.memo(ShoukaiSection);
