'use client';

import React, { useRef, useState } from 'react';
import TextReveal from '@/components/shared/TextReveal';
import { OmikujiResponse } from '@/types/omikuji';
import Modal from '../shared/Modal';
import OmikujiModal from './OmikujiModal';
import { apiFetch } from '@/lib/api';
import OmikujiLoding from './OmikujiLoding';
import { Button } from '../shared/Button';

type Props = {
  isActive: boolean;
  isNeighbor: boolean;
};

const OmikujiSection = ({ isActive, isNeighbor }: Props) => {
  console.log('OmikujiSection', isActive, isNeighbor);
  const [loading, setLoading] = useState(false);
  const resultRef = useRef<OmikujiResponse | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchOmikuji = async () => {
    setLoading(true);
    try {
      const body = {
        type: 'shikineko',
        period: '今年',
      };
      const data = await apiFetch<OmikujiResponse>('/api/omikuji', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      // // モックデータを使用
      // const data: OmikujiResponse = {
      //   id: '1',
      //   type: 'shikineko',
      //   period: '今年',
      //   fortune: '大吉',
      //   msg: '今年はとても良い年になりそうです。新しいことに挑戦するのに適した時期です。',
      //   details: [
      //     { type: '仕事運', rank: 5, element: '新しいプロジェクトで成功が見込めます' },
      //     { type: '金運', rank: 4, element: '堅実な投資が実を結びそうです' },
      //     { type: '恋愛運', rank: 3, element: '穏やかな関係が続きそうです' },
      //     { type: '健康運', rank: 4, element: '規則正しい生活で体調は良好です' },
      //     { type: 'コードレビュー', rank: 5, element: '新しい知識を得るのに最適な時期です' },
      //     { type: '旅行運', rank: 3, element: '短距離の旅行が吉です' },
      //     { type: '芸術運', rank: 4, element: '創造性が高まる時期です' },
      //     { type: '家族運', rank: 5, element: '家族との絆が深まります' },
      //     { type: '友情運', rank: 4, element: '新しい出会いがありそうです' },
      //     { type: '趣味運', rank: 3, element: '新しい趣味を始めるのに良い時期です' },
      //   ],
      //   createdAt: '2025-05-07 12:00:00',
      // };
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
        <Button variant="positive" onClick={fetchOmikuji}>
          おみくじを引く
        </Button>
      </div>

      {/* おみくじ抽選中画面 */}
      <Modal
        isOpen={loading}
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50"
      >
        <OmikujiLoding />
      </Modal>

      {resultRef.current && (
        <Modal
          isOpen={isOpen}
          className="absolute top-0 left-0 min-h-[100lvh] min-w-[100vw] bg-transparent overscroll-contain"
        >
          <OmikujiModal
            omikujiResponse={resultRef.current}
            onClose={() => setIsOpen(false)}
          ></OmikujiModal>
        </Modal>
      )}
    </>
  );
};

export default React.memo(OmikujiSection);
