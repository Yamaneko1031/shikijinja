'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import Image from 'next/image';

export type BackgroundManagerHandle = {
  isReadyForTransition: () => boolean;
  setUrl: (url: string, bgPos: string) => void;
};

type Props = {
  initialUrl: string;
  initialBgPosition?: string;
};

export const BackgroundManager = forwardRef<BackgroundManagerHandle, Props>((props, ref) => {
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [activeUrl, setActiveUrl] = useState<string>(props.initialUrl);
  const [bgPosition, setBgPosition] = useState<string>(props.initialBgPosition || 'center');
  const [prevBgPosition, setPrevBgPosition] = useState<string>('center');
  const isReadyForTransitionRef = useRef(true);
  const fadeDuration = 1.2;

  useImperativeHandle(ref, () => ({
    isReadyForTransition: () => isReadyForTransitionRef.current,
    setUrl: (url: string, bgPos: string = 'center') => {
      if (isReadyForTransitionRef.current && url !== activeUrl) {
        isReadyForTransitionRef.current = false;
        setPrevUrl(activeUrl);
        setPrevBgPosition(bgPosition);
        setActiveUrl(url);
        setBgPosition(bgPos);

        // アニメーションが6割り終わったら次のアニメーションを許可
        setTimeout(
          () => {
            setPrevUrl(null);
            isReadyForTransitionRef.current = true;
          },
          fadeDuration * 1000 * 0.6
        );
      }
    },
  }));

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      {/* 最初の背景だけ優先的にプリロード */}
      {prevUrl === null && activeUrl && (
        <Image
          src={activeUrl}
          alt="initial background preload"
          priority
          style={{ display: 'none' }}
          width={1}
          height={1}
        />
      )}

      {prevUrl && (
        <motion.div
          key={prevUrl + '-prev'}
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: `url(${prevUrl})`,
            backgroundPosition: prevBgPosition,
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: fadeDuration }}
        />
      )}

      {activeUrl && (
        <motion.div
          key={activeUrl + '-active'}
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: `url(${activeUrl})`,
            backgroundPosition: bgPosition,
          }}
          initial={{ opacity: prevUrl ? 0 : 1 }}
          animate={{ opacity: 1 }}
          // クロスフェードの新しい背景表示の方が少し速く完了させる
          transition={{ duration: prevUrl ? fadeDuration * 0.8 : 0 }}
        />
      )}
    </div>
  );
});

BackgroundManager.displayName = 'BackgroundManager';
