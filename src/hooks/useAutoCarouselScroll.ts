'use client';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { DisplayPost } from '@/types/ema';
import { RefObject } from 'react';

export const useAutoCarouselScroll = (
  carouselRef: RefObject<HTMLDivElement | null>,
  displayPosts: DisplayPost[],
  setDisplayPosts: React.Dispatch<React.SetStateAction<DisplayPost[]>>,
  isTouchingRef: RefObject<boolean>,
  isActive: boolean
) => {
  const scrollShiftRef = useRef<number>(0);
  const scrollLeftPrev = useRef(0);
  const scrollLeftLoopStopCount = useRef(0);

  // 自動スクロールループ
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      const container = carouselRef.current;
      if (!container) return;

      if (!isTouchingRef.current) {
        if (container.scrollLeft === scrollLeftPrev.current) {
          if (scrollLeftLoopStopCount.current > 0) {
            scrollLeftLoopStopCount.current -= 1;
          } else {
            container.scrollTo({ left: container.scrollLeft + 2, behavior: 'auto' });

            if (container.children.length < 10) return;
            const seventh = container.children[6] as HTMLElement;
            if (seventh.getBoundingClientRect().left < window.innerWidth / 2) {
              scrollShiftRef.current = Array.from(container.children)
                .slice(0, 3)
                .reduce((acc, child) => {
                  const el = child as HTMLElement;
                  return acc + el.offsetWidth + parseFloat(getComputedStyle(el).marginRight);
                }, 0);
              setDisplayPosts((prev) => [...prev.slice(3), ...prev.slice(0, 3)]);
            }
          }
        }
        scrollLeftPrev.current = container.scrollLeft;
      }
    }, 60);
    return () => clearInterval(interval);
  }, [isActive, carouselRef, isTouchingRef, setDisplayPosts]);

  // displayPosts 更新時のスクロール補正
  useLayoutEffect(() => {
    if (scrollShiftRef.current && carouselRef.current) {
      carouselRef.current.scrollLeft -= scrollShiftRef.current;
      scrollShiftRef.current = 0;
    }
  }, [displayPosts, carouselRef]);
};
