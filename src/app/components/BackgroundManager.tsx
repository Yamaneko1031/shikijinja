// BackgroundManager.tsx
'use client';

import { useState, useRef, useImperativeHandle, forwardRef } from 'react';

export type BackgroundManagerHandle = {
  isReadyForTransition: () => boolean;
  setUrl: (url: string, bgPos: string) => void;
};

type Props = {
  initialUrl: string;
  initialBgPosition?: string;
};

const allUrls = [
  '/images/bg_top.webp',
  '/images/bg_sando.webp',
  '/images/bg_ema.webp',
  '/images/bg_omamori.webp',
  '/images/bg_omikuji.webp',
];

export const BackgroundManager = forwardRef<BackgroundManagerHandle, Props>((props, ref) => {
  const [activeUrl, setActiveUrl] = useState<string>(props.initialUrl);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [bgPosition, setBgPosition] = useState<string>(props.initialBgPosition || 'center');
  const [prevBgPosition, setPrevBgPosition] = useState<string>('center');
  const isReadyForTransitionRef = useRef(true);
  const fadeDuration = 1.2 * 1000;

  useImperativeHandle(ref, () => ({
    isReadyForTransition: () => isReadyForTransitionRef.current,
    setUrl: (url: string, bgPos: string = 'center') => {
      if (isReadyForTransitionRef.current && url !== activeUrl) {
        isReadyForTransitionRef.current = false;
        setPrevUrl(activeUrl);
        setPrevBgPosition(bgPosition);
        setActiveUrl(url);
        setBgPosition(bgPos);

        setTimeout(() => {
          setPrevUrl(null);
          isReadyForTransitionRef.current = true;
        }, fadeDuration * 0.6);
      }
    },
  }));

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      {/* 最初の画像を明示的にプリロード（最優先） */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={props.initialUrl}
        alt="initial preload"
        style={{ display: 'none' }}
        width={1}
        height={1}
        loading="eager"
      />

      {/* 全ての画像をDOMに保持し、active/prevだけ表示 */}
      {allUrls.map((url) => {
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={url}
            src={url}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100lvh',
              objectFit: 'cover',
              objectPosition:
                url === activeUrl ? bgPosition : url === prevUrl ? prevBgPosition : 'center',
              opacity: url === activeUrl ? 1 : url === prevUrl ? 0 : 0,
              zIndex: url === activeUrl ? 1 : url === prevUrl ? 0 : -1,
              transition: 'opacity 1.2s ease',
              display: 'block',
              transform: 'translateZ(0.01px)',
            }}
          />
        );
      })}
    </div>
  );
});

BackgroundManager.displayName = 'BackgroundManager';
