'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NadenekoResponse } from '@/types/nadeneko';

type Props = {
  lotData: NadenekoResponse;
  handleFinished: () => void;
};

type DragState = 'standby' | 'waiting' | 'finished';

const waitTime = 100;
const finishedTime = 2000;

const coinPopupElementCount = 10;
const coinOffsetLeftRange = 16;
const coinOffsetTopRange = 16;
const coinBasePositions = [
  { left: 20, top: 20 },
  { left: 35, top: 20 },
  { left: 50, top: 20 },
  { left: 65, top: 20 },
  { left: 80, top: 20 },
  { left: 20, top: 40 },
  { left: 35, top: 40 },
  { left: 50, top: 40 },
  { left: 65, top: 40 },
  { left: 80, top: 40 },
  { left: 20, top: 60 },
  { left: 35, top: 60 },
  { left: 50, top: 60 },
  { left: 65, top: 60 },
  { left: 80, top: 60 },
];

export default function NadenekoSeat({ lotData, handleFinished }: Props) {
  const draggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const targetAreaRef = useRef<HTMLDivElement>(null);
  const getCoinIndexRef = useRef(0);
  const dragStateRef = useRef<DragState>('standby');
  const [screenClass, setScreenClass] = useState('');
  const [coinClasses, setCoinClasses] = useState(Array(coinPopupElementCount).fill(''));
  const coinValueRef = useRef(Array(coinPopupElementCount).fill(0));
  const coinPositionRef = useRef(Array(coinPopupElementCount).fill({ left: 0, top: 0, rate: 1 }));
  const randomPositionIndeicesRef = useRef(
    Array.from({ length: coinBasePositions.length }, (_, i) => i)
  );

  useEffect(() => {
    randomPositionIndeicesRef.current = (() => {
      const arr = Array.from({ length: coinBasePositions.length }, (_, i) => i);
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    })();
  }, []);

  const eventStop = (e: WheelEvent | TouchEvent) => {
    e.preventDefault();
  };

  // ドラッグ開始イベント
  const handleMouseDown = (e: React.MouseEvent) => {
    draggingRef.current = true;
    startPosRef.current = { x: e.clientX, y: e.clientY };
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    draggingRef.current = true;
    startPosRef.current = { x: touch.clientX, y: touch.clientY };
  };

  // ドラッグ中の移動処理
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (draggingRef.current === false) return;
      if (getCoinIndexRef.current >= lotData.addCoins.length) return;

      // ドラッグした移動量を取得
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      // ドラッグ領域から一定以上外に出ないように移動量を補正
      let isInArea = false;
      if (targetAreaRef.current) {
        const targetArea = targetAreaRef.current.getBoundingClientRect();
        if (
          targetArea.left < clientX &&
          clientX < targetArea.right &&
          targetArea.top < clientY &&
          clientY < targetArea.bottom
        ) {
          isInArea = true;
        }
      }

      if (isInArea && dragStateRef.current === 'standby') {
        console.log(getCoinIndexRef.current, dragStateRef.current, isInArea);
        dragStateRef.current = 'waiting';

        setCoinClasses((prev) => {
          const newStates = [...prev];
          newStates[getCoinIndexRef.current % coinPopupElementCount] = '';
          return newStates;
        });

        // 新しいアニメーションを設定
        setTimeout(() => {
          coinValueRef.current[getCoinIndexRef.current % coinPopupElementCount] =
            lotData.addCoins[getCoinIndexRef.current];

          setCoinClasses((prev) => {
            const newStates = [...prev];
            newStates[getCoinIndexRef.current % coinPopupElementCount] = `coin--popup`;
            return newStates;
          });

          const randomOffetLeft =
            Math.floor(Math.random() * coinOffsetLeftRange) - coinOffsetLeftRange / 2;
          const randomOffetTop =
            Math.floor(Math.random() * coinOffsetTopRange) - coinOffsetTopRange / 2;
          let rateValue = 1.0;
          switch (coinValueRef.current[getCoinIndexRef.current % coinPopupElementCount]) {
            case 1:
              rateValue = 1.0;
              break;
            case 2:
              rateValue = 1.2;
              break;
            case 5:
              rateValue = 1.5;
              break;
            case 10:
              rateValue = 2.0;
              break;
            case 30:
              rateValue = 3.0;
              break;
          }
          coinPositionRef.current[getCoinIndexRef.current % coinPopupElementCount] = {
            left:
              coinBasePositions[
                randomPositionIndeicesRef.current[getCoinIndexRef.current % coinPopupElementCount]
              ].left + randomOffetLeft,
            top:
              coinBasePositions[
                randomPositionIndeicesRef.current[getCoinIndexRef.current % coinPopupElementCount]
              ].top + randomOffetTop,
            rate: rateValue,
          };

          // 一定期間は待ち状態
          setTimeout(() => {
            dragStateRef.current = 'standby';
            getCoinIndexRef.current = getCoinIndexRef.current + 1;
            if (getCoinIndexRef.current >= lotData.addCoins.length) {
              dragStateRef.current = 'finished';
              setScreenClass('animate-nadeneko-screen-finish');
              setTimeout(() => {
                handleFinished();
              }, finishedTime);
            }
          }, waitTime);
        }, 10);
      }

      startPosRef.current = { x: clientX, y: clientY };
    };

    const handleEnd = () => {
      draggingRef.current = false;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    window.addEventListener('wheel', eventStop, { passive: false });
    window.addEventListener('touchmove', eventStop, { passive: false });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);

      window.removeEventListener('wheel', eventStop);
      window.removeEventListener('touchmove', eventStop);
    };
  }, [handleFinished, lotData.addCoins]);

  //   console.log(coinRateClasses);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* ドラッグ領域 */}
      <div
        className={
          'absolute max-w-[30rem] min-w-[25rem] w-[100vw] aspect-square bg-[url("/images/nadeneko/neko_action.png")] bg-[length:100%_auto] bg-no-repeat rounded-md border-4 border-[rgba(40,20,0,0.5)] ' +
          screenClass
        }
        onMouseDown={(e) => handleMouseDown(e)}
        onTouchStart={(e) => handleTouchStart(e)}
        style={{ touchAction: 'none' }} // 追加: ブラウザのデフォルトタッチ動作を無効化
      >
        {/* <div className="absolute top-15 left-20 text-center text-white font-bold text-xl text-shadow-huchi2">
          にゃんー！
        </div>
        <div className="absolute top-20 left-20 text-center text-white font-bold text-xl text-shadow-huchi2">
          ごろごろ。
        </div>
        <div className="absolute top-25 left-20 text-center text-white font-bold text-xl text-shadow-huchi2">
          うにゃー。
        </div>
        <div className="absolute top-30 left-20 text-center text-white font-bold text-xl text-shadow-huchi2">
          にゃー！
        </div>
        <div className="absolute top-35 left-20 text-center text-white font-bold text-xl text-shadow-huchi2">
          にゃにゃーん！
        </div>
        <div className="absolute top-40 left-20 text-center text-white font-bold text-xl text-shadow-huchi2">
          ふにゃー。
        </div>
        <div className="absolute top-45 left-20 text-center text-white font-bold text-xl text-shadow-huchi2">
          にゃにゃ！
        </div> */}
        <div className="absolute top-10 left-0 w-full h-full text-center text-white font-bold text-4xl text-shadow-huchi2">
          ↓なでて！
        </div>

        {/* なでる判定領域 */}
        <div className="absolute top-[26%] left-[26%] w-[48%] h-[68%]" ref={targetAreaRef}></div>

        {/* コインのアニメーション */}
        <div className="nadeneko-coin-popup-position">
          {Array.from({ length: coinPopupElementCount }).map((_, index) => (
            <div
              key={index}
              className="absolute"
              style={{
                left: `${coinPositionRef.current[index].left}%`,
                top: `${coinPositionRef.current[index].top}%`,
                transform: `scale(${coinPositionRef.current[index].rate})`,
              }}
            >
              <div className={`nadeneko-coin -translate-x-1/2 ${coinClasses[index]}`}>
                <p className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-3/5 text-3xl font-bold text-shadow-huchi">
                  {coinValueRef.current[index]}
                </p>
              </div>
            </div>
          ))}
        </div>

        {dragStateRef.current === 'finished' && (
          <div className="absolute w-full h-full flex items-center justify-center">
            <div className="-rotate-10 text-white font-bold text-7xl text-shadow-huchi2 whitespace-nowrap">
              満足にゃ！
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
