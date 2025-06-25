'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { User } from '@/types/user';
import { getCssDuration } from '@/utils/getCssDuration';

interface HeaderCoinCounterProps {
  user: User;
}

const HeaderCoinCounter: React.FC<HeaderCoinCounterProps> = (props) => {
  const [viewCoin, setViewCoin] = useState(props.user.coin);
  const targetViewCoinRef = useRef(props.user.coin);
  // ポップアップ用
  const [popup, setPopup] = useState<null | { diff: number; key: number }>(null);

  useEffect(() => {
    if (targetViewCoinRef.current != props.user.coin) {
      // 獲得分算出
      const diff = props.user.coin - targetViewCoinRef.current;
      if (diff !== 0) {
        // ポップアップを発火
        setPopup({ diff, key: Date.now() });
      }
      targetViewCoinRef.current = props.user.coin;
    }

    if (targetViewCoinRef.current > viewCoin) {
      requestAnimationFrame(() => {
        setViewCoin(viewCoin + 1);
      });
    } else if (targetViewCoinRef.current < viewCoin) {
      requestAnimationFrame(() => {
        setViewCoin(viewCoin - 1);
      });
    }
  }, [viewCoin, props.user.coin]);

  // ポップアップのクリア
  useEffect(() => {
    if (popup) {
      const duration = getCssDuration('--coin-popup-duration');
      const t = setTimeout(() => setPopup(null), duration);
      return () => clearTimeout(t);
    }
  }, [popup]);

  return (
    <div className="h-[3.125rem] w-[5.75rem] flex items-center gap-1">
      <Image
        src="/images/icon/icon_coin.webp"
        alt="徳コイン"
        width={32}
        height={32}
        className="w-8 h-8"
      />
      <span className="text-xl text-gray-600">{viewCoin}</span>
      {/* ポップアップ */}
      {popup && (
        <span
          key={popup.key}
          className={`absolute left-12 top-8 text-xl font-bold
            ${popup.diff > 0 ? 'text-green-600' : 'text-red-600'}
            animate-coin-popup`}
        >
          {popup.diff > 0 ? `+${popup.diff}` : popup.diff}
        </span>
      )}
    </div>
  );
};

export default HeaderCoinCounter;
