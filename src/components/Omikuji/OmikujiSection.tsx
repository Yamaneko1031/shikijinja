'use client';

import React, { useRef, useState } from 'react';
import TextReveal from '@/components/shared/TextReveal';
import Image from 'next/image';
import { OmikujiResult } from '@/types/omikuji';
import Modal from '../shared/Modal';
import OmikujiModal from './OmikujiModal';

type Props = {
  isActive: boolean;
  isNeighbor: boolean;
};

const OmikujiSection = ({ isActive, isNeighbor }: Props) => {
  console.log('OmikujiSection', isActive, isNeighbor);
  const [loading, setLoading] = useState(false);
  const resultRef = useRef<OmikujiResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchOmikuji = async () => {
    setLoading(true);
    try {
      const body = {
        templateKey: 'omikuji_shikineko',
        period: '今年',
      };
      const res = await fetch('/api/omikuji', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as OmikujiResult;
      console.log('data', data);
      console.log('data.details', data.details);
      resultRef.current = data;
      setIsOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative top-[600px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] p-10 bg-black/50 rounded-lg">
        <TextReveal
          text="おみくじを引けるコンテンツ"
          delayPerChar={0.1}
          className="text-2xl font-bold mb-4"
        />
        <button
          onClick={fetchOmikuji}
          className={`px-4 py-2 rounded ${
            loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          disabled={loading}
        >
          {loading ? '神様と交信中…' : 'おみくじを引く'}
        </button>
      </div>
      {resultRef.current && (
        <Modal isOpen={isOpen}>
          <OmikujiModal omikujiResult={resultRef.current} onClose={() => setIsOpen(false)}>
            {/* <Image src="/images/omikuji/omikuji.png" alt="おみくじ" width={400} height={800} /> */}
            {/* {resultRef.current && (
              <div className="relative flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">おみくじ結果</h2>
                <div className="space-y-4">
                  <p className="text-xl">{resultRef.current.fortune}</p>
                  <p>{resultRef.current.msg}</p>
                  <div>
                    <h3 className="font-bold mb-2">運勢の詳細:</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {resultRef.current.details?.map((detail, index) => (
                        <li key={index}>
                          {detail.type} {detail.rank} {detail.element}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )} */}
          </OmikujiModal>
        </Modal>
      )}
    </>
  );
};

export default React.memo(OmikujiSection);
