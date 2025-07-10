'use client';

import React, { useState, useRef } from 'react';
import TextReveal from '@/components/_shared/TextReveal';
import { Button } from '../_shared/Button';
import Image from 'next/image';
import { SectionProps } from '@/types/section';
import { apiFetch } from '@/lib/api';
import { NadenekoBantukeResponse, NadenekoResponse } from '@/types/nadeneko';
import Modal from '../_shared/Modal';
import NadenekoModal from './NadenekoModal';
import { useLoadImages } from '@/hooks/useLoadImages';
import useSWR from 'swr';
import { getTokuCoin } from '@/utils/toku';
import NadenekoBantuke from './NadenekoBantuke';

const NadenekoSection = (props: SectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBantukeModalOpen, setIsBantukeModalOpen] = useState(false);
  const [lotData, setLotData] = useState<NadenekoResponse | null>(null);
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);
  const loadedImages = useLoadImages(props.isActive || props.isNeighbor, [
    '/images/nadeneko/nadeneko_result.webp',
    '/images/nadeneko/nadeneko_action.webp',
  ]);
  loadedImagesRef.current = loadedImages;

  const fetcher = (url: string) => apiFetch<NadenekoBantukeResponse>(url).then((res) => res);
  const {
    data: rankingData,
    isLoading: isLoadingRankingData,
    mutate: mutateRankingData,
  } = useSWR('/api/nadeneko/ranking', fetcher, {
    revalidateOnFocus: false,
  });

  const handlePet = async () => {
    setIsModalOpen(true);

    try {
      const data = await apiFetch<NadenekoResponse>('/api/nadeneko', {
        method: 'POST',
      });
      setLotData(data);
      props.handleTokuGet('nadeneko', false);
      mutateRankingData();
    } catch (err) {
      console.error('nadeneko error:', err);
      alert('なでるのに失敗しました。再度お試しください。');
      setIsModalOpen(false);
    }
  };

  const handleBantukeModalClose = () => {
    if (!props.handleIsLimitOver('bantuke')) {
      props.handleTokuGet('bantuke');
    }
    setIsBantukeModalOpen(false);
  };

  return (
    <>
      <div className="relative max-w-2xl min-w-[20rem] top-[37.5rem] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <div className="relative h-full w-full bg-black/50 rounded-lg flex flex-col gap-2 pt-4 pl-4 pb-4 pr-[11.25rem]">
          <div className="">
            <TextReveal
              text="（じー・・・）"
              delayPerChar={0.1}
              className="text-xl md:text-2xl font-bold"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-[12.5rem]">
            <Image
              src="/images/nadeneko/neko_nadeneko.webp"
              alt="neko_nadeneko"
              width={400}
              height={300}
            />
          </div>
        </div>

        <div className="relative w-full bg-black/50 rounded-lg flex flex-col items-center gap-2 p-4">
          <div className="w-full text-xl flex flex-col items-start">
            <p>なでるとご利益があるとされている「なでねこ像」</p>
            {props.handleIsLimitOver('nadeneko') ? (
              <p>満足そうにしている気がします。</p>
            ) : (
              <>
                <p>こちらを見ている気がします。</p>
              </>
            )}
          </div>
          <Button
            variant="positive"
            size="lg"
            onClick={() => setIsBantukeModalOpen(true)}
            className="w-full max-w-md flex flex-col pt-2 pb-2"
          >
            <div className="text-xl font-bold">番付を見る</div>
            {!props.handleIsLimitOver('bantuke') && (
              <div className="flex flex-row items-center">
                <Image
                  src="/images/icon/icon_coin.webp"
                  alt="omikuji_button"
                  width={24}
                  height={24}
                />
                <div className="text-sm text-yellow-400 font-bold">
                  {getTokuCoin('bantuke')}獲得（初回）
                </div>
              </div>
            )}
          </Button>
          <Button
            variant="positive"
            size="lg"
            onClick={() => {
              handlePet();
            }}
            className="w-full max-w-md flex flex-col pt-2 pb-2"
            disabled={isModalOpen || props.handleIsLimitOver('nadeneko')}
          >
            <div className="text-xl font-bold">なでる</div>
            <div className="flex flex-row items-center">
              {props.handleIsLimitOver('nadeneko') ? (
                <div className="text-sm text-yellow-800 font-bold">本日分済み</div>
              ) : (
                <>
                  <Image
                    src="/images/icon/icon_coin.webp"
                    alt="omikuji_button"
                    width={24}
                    height={24}
                  />
                  <div className="text-sm text-yellow-400 font-bold">ランダム獲得（1日1回）</div>
                </>
              )}
            </div>
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isBantukeModalOpen}
        className="absolute top-0 left-0 min-h-[100lvh] min-w-[100vw] bg-transparent overscroll-contain"
      >
        <NadenekoBantuke
          onClose={handleBantukeModalClose}
          rankingData={rankingData}
          isLoading={isLoadingRankingData}
        />
      </Modal>

      <Modal
        isOpen={isModalOpen}
        className="absolute top-0 left-0 min-h-[100lvh] min-w-[100vw] bg-transparent overscroll-contain"
      >
        <NadenekoModal
          onClose={() => setIsModalOpen(false)}
          lotData={lotData}
          handleAddCoin={props.handleAddCoin}
          handleTokuGet={props.handleTokuGet}
          handleIsLimitOver={props.handleIsLimitOver}
        />
      </Modal>
    </>
  );
};

export default React.memo(NadenekoSection);
