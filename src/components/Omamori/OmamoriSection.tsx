'use client';

import React, { useRef, useState } from 'react';
import TextReveal from '@/components/_shared/TextReveal';
import { SectionProps } from '@/types/section';
import Image from 'next/image';
import { OmamoriData } from '@/types/omamori';
import { apiFetch } from '@/lib/api';
import OmamoriWindow from './OmamoriWindow';
import Modal from '../_shared/Modal';
import OmamoriLoading from './OmamoriLoading';
import OmamoriModal from './OmamoriModal';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OmamoriSection = (props: SectionProps) => {
  const [loading, setLoading] = useState(false);
  const [omamoriData, setOmamoriData] = useState<OmamoriData | null>(null);
  const [omamoriModalOpen, setOmamoriModalOpen] = useState(false);
  const omamoriDataRef = useRef<OmamoriData | null>(null);

  const handlePurchase = async (selectedOmamori: OmamoriData) => {
    setOmamoriData(selectedOmamori);
    setLoading(true);
    omamoriDataRef.current = await apiFetch<OmamoriData>('/api/omamori/buy', {
      method: 'POST',
      body: JSON.stringify({ omamoriName: selectedOmamori.name }),
    });
    await new Promise((resolve) => setTimeout(resolve, 5000));
    setLoading(false);
    setOmamoriModalOpen(true);
  };

  return (
    <>
      <div className="relative max-w-2xl min-w-[20rem] top-[37.5rem] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <div className="relative h-full w-full bg-black/50 rounded-lg flex flex-col gap-2 pt-4 pl-4 pb-4 pr-[11.25rem]">
          <div className="">
            <TextReveal
              text="お守りがあるにゃ！"
              delayPerChar={0.1}
              className="text-xl md:text-2xl font-bold"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-[12.5rem]">
            <Image
              src="/images/omamori/neko_omamori.webp"
              alt="neko_omamori"
              width={400}
              height={300}
            />
          </div>
        </div>
        <OmamoriWindow handlePurchase={handlePurchase} />
      </div>

      {/* おみくじ抽選中画面 */}
      <Modal isOpen={loading} className="relative min-w-[20rem] w-[30rem] mx-2 overscroll-contain">
        <OmamoriLoading omamoriData={omamoriData} />
      </Modal>

      <Modal isOpen={omamoriModalOpen}>
        {omamoriDataRef.current && (
          <OmamoriModal
            omamoriData={omamoriDataRef.current}
            onClose={() => setOmamoriModalOpen(false)}
          />
        )}
      </Modal>
    </>
  );
};

export default React.memo(OmamoriSection);
