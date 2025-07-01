'use client';

import { use, useEffect, useState } from 'react';
import useSWR from 'swr';
import { OmamoriDataResponse } from '@/types/omamori';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/_shared/Button';
import Image from 'next/image';
import Modal from '@/components/_shared/Modal';
import OmamoriSeat from '@/components/Omamori/OmamoriSeat';

export default function OmamoriPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const fetcher = (url: string) => apiFetch<OmamoriDataResponse>(url).then((res) => res);
  const { data: omamori, isLoading: isLoadingOmamori } = useSWR(`/api/omamori/${id}`, fetcher, {
    revalidateOnFocus: false,
  });
  const [rate, setRate] = useState(1);
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    if (omamori) {
      setIsOpenModal(true);
    }
  }, [omamori]);

  let transformOrigin = `left top`;
  if (rate < 1) {
    transformOrigin = `center center`;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[url('/images/bg_hude/bg_omamori.webp')] bg-cover bg-center">
      <Modal
        isOpen={isOpenModal}
        className="absolute top-0 left-0 min-h-[100lvh] min-w-[100vw] bg-transparent overscroll-contain"
      >
        <div className="select-none">
          <div className="min-h-[100lvh] pt-5 flex flex-col items-center">
            <div
              className="m-auto pb-20"
              style={{
                transform: `scale(${rate})`,
                transformOrigin: transformOrigin,
              }}
            >
              <div className="">
                {isLoadingOmamori ? (
                  <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                  </div>
                ) : omamori ? (
                  <div className="flex justify-center">
                    <OmamoriSeat omamoriData={omamori} />
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <p>お守りの結果が見つかりません</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="fixed w-full bottom-6 m-auto flex flex-row justify-center gap-2">
            <Link href="/" prefetch={true}>
              <Button variant="positive" size="md">
                神社に行ってみる
              </Button>
            </Link>
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
      </Modal>
    </div>
  );
}
