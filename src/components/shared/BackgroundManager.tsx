'use client';

import { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';

export type BackgroundManagerHandle = {
  isReadyForTransition: () => boolean;
  setUrl: (url: string, effect: ScrollEffect[]) => void;
  setScrollRatio: (ratio: number) => void;
};

type ScrollEffect = {
  ratio: number;
  posX: number;
  posY: number;
  zoom: number;
};

type Props = {
  initialUrl: string;
  allUrls: string[];
  scrollEffect?: ScrollEffect[];
};

export const BackgroundManager = forwardRef<BackgroundManagerHandle, Props>((props, ref) => {
  const [activeUrl, setActiveUrl] = useState<string>(props.initialUrl);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [activeScrollEffect, setActiveScrollEffect] = useState<ScrollEffect[]>(
    props.scrollEffect ?? []
  );
  const [bgPosition, setBgPosition] = useState<string>(() => {
    const effect = props.scrollEffect?.[0];
    return effect ? `${effect.posX}% ${effect.posY}%` : 'center';
  });
  const [prevScale, setPrevScale] = useState<number | null>(null);
  const [scale, setScale] = useState<number>(() => {
    const effect = props.scrollEffect?.[0];
    return effect ? effect.zoom : 1;
  });
  const [prevBgPosition, setPrevBgPosition] = useState<string>('center');
  const [delayedLoad, setDelayedLoad] = useState(false);
  const isReadyForTransitionRef = useRef(true);
  const fadeDuration = 1.2 * 1000;

  useEffect(() => {
    const timer = setTimeout(() => setDelayedLoad(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useImperativeHandle(ref, () => ({
    isReadyForTransition: () => isReadyForTransitionRef.current,
    setUrl: (url: string, effect: ScrollEffect[]) => {
      if (isReadyForTransitionRef.current && url !== activeUrl) {
        isReadyForTransitionRef.current = false;

        setPrevUrl(activeUrl);
        setPrevBgPosition(bgPosition);
        setPrevScale(scale);
        setActiveUrl(url);
        setActiveScrollEffect(effect);

        setTimeout(() => {
          setPrevUrl(null);
          isReadyForTransitionRef.current = true;
        }, fadeDuration * 0.6);
      }
    },
    setScrollRatio: (ratio: number) => {
      const effect = activeScrollEffect;
      if (!effect || effect.length === 0) return;

      const interpolate = (frames: [number, number][], ratio: number) => {
        if (ratio <= frames[0][0]) return frames[0][1];
        if (ratio >= frames[frames.length - 1][0]) return frames[frames.length - 1][1];

        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
        for (let i = 0; i < frames.length - 1; i++) {
          const [startR, startV] = frames[i];
          const [endR, endV] = frames[i + 1];
          if (ratio >= startR && ratio <= endR) {
            const t = (ratio - startR) / (endR - startR);
            return lerp(startV, endV, t);
          }
        }

        return frames[frames.length - 1][1];
      };
      const posX = interpolate(
        effect.map((e) => [e.ratio, e.posX]),
        ratio
      );
      const posY = interpolate(
        effect.map((e) => [e.ratio, e.posY]),
        ratio
      );
      const zoom = interpolate(
        effect.map((e) => [e.ratio, e.zoom]),
        ratio
      );
      setBgPosition(`${posX}% ${posY}%`);
      setScale(zoom);
    },
  }));

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      {/* 最初の画像を明示的にプリロード */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={props.initialUrl}
        alt="initial preload"
        style={{ display: 'none' }}
        width={1}
        height={1}
        loading="eager"
      />

      {/* 全ての画像をDOMに保持し、active/prevだけ表示、残りは遅延で表示 */}
      {props.allUrls.map((url) => {
        const shouldRender = url === activeUrl || url === prevUrl || delayedLoad;
        if (!shouldRender) return null;

        // if (url === activeUrl) console.log('activeUrl', bgPosition);
        // if (url === prevUrl) console.log('prevUrl', prevBgPosition);

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
              transform: `scale(${url === activeUrl ? scale : url === prevUrl ? prevScale : 1}) translateZ(0.01px)`,
            }}
          />
        );
      })}
    </div>
  );
});

BackgroundManager.displayName = 'BackgroundManager';
