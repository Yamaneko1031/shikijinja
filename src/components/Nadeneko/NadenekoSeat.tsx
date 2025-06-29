'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NadenekoResponse } from '@/types/nadeneko';
import { coinBasePositions, subMessageTable } from '@/config/nadeneko';
import { getCssDuration } from '@/utils/getCssDuration';
import { Button } from '../_shared/Button';
import HelpWindow from '../_shared/HelpWindow';
import NadenekoHelp from './NadenekoHelp';

type Props = {
  lotData: NadenekoResponse | null;
  handleFinished: () => void;
};

type DragState = 'standby' | 'waiting' | 'finished';
type SubMessage = {
  key: string;
  message: string;
  animateClassNumber: number;
  top: number;
  left: number;
};

const waitTime = 100;
const finishedTime = 3000;
const petMessageTime = 2000;
const coinAddDelayTime = 1500;
const coinPopupElementCount = 10;
const coinOffsetLeftRange = 16;
const coinOffsetTopRange = 16;

export default function NadenekoSeat({ lotData, handleFinished }: Props) {
  const draggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const targetAreaRef = useRef<HTMLDivElement>(null);
  const dragCountRef = useRef(0);
  const subMessageCountRef = useRef(0);
  const getCoinIndexRef = useRef(0);
  const dragStateRef = useRef<DragState>('standby');
  const [screenClass, setScreenClass] = useState('');
  const [coinClasses, setCoinClasses] = useState(Array(coinPopupElementCount).fill(''));
  const [petMessage, setPetMessage] = useState(false);
  const [subMessages, setSubMessages] = useState<SubMessage[]>([]);
  const [totalCoin, setTotalCoin] = useState(0);
  const [isAuto, setIsAuto] = useState(false);
  const [isHelp, setIsHelp] = useState(false);
  const previousSubMessageRef = useRef<SubMessage | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const coinValueRef = useRef(Array(coinPopupElementCount).fill(0));
  const coinPositionRef = useRef(Array(coinPopupElementCount).fill({ left: 0, top: 0, rate: 1 }));
  const randomPositionIndeicesRef = useRef(
    Array.from({ length: coinBasePositions.length }, (_, i) => i)
  );

  // 初回のセットアップ
  useEffect(() => {
    if (lotData) {
      setPetMessage(true);
      subMessageCountRef.current = Math.floor(Math.random() * 10) + 10;
      dragCountRef.current = Math.floor(Math.random() * 5) + 5;
    }
  }, [lotData]);

  // コインの基準位置をランダムにシャッフル
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

  // なでてメッセージを消す
  const setPetMessageClear = useCallback((isShowAgain: boolean = false) => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    setPetMessage(false);
    // 再表示設定
    if (isShowAgain) {
      // 一定期間は待ち状態
      timeoutIdRef.current = setTimeout(() => {
        setPetMessage(true);
      }, petMessageTime);
    }
  }, []);

  // サブメッセージの削除
  const deleteSubMessages = useCallback(
    (key: string) => {
      setSubMessages((prev) => prev.filter((subMessage) => subMessage.key !== key));
    },
    [setSubMessages]
  );

  // サブメッセージの表示
  const postSubMessages = useCallback(() => {
    let animateClassNumber = Math.floor(Math.random() * 4) + 1;
    // 連続回避
    if (previousSubMessageRef.current?.animateClassNumber === animateClassNumber) {
      animateClassNumber = ((animateClassNumber + 1) % 4) + 1;
    }
    const newSubMessage: SubMessage = {
      message: subMessageTable[Math.floor(Math.random() * subMessageTable.length)],
      animateClassNumber,
      top: Math.floor((Math.random() * 4 - 2) * 10) / 10,
      left: Math.floor((Math.random() * 4 - 2) * 10) / 10,
      key: Math.random().toString(36).substring(2, 15),
    };
    previousSubMessageRef.current = newSubMessage;
    setSubMessages((prev) => [...prev, newSubMessage]);
    setTimeout(() => {
      deleteSubMessages(newSubMessage.key);
    }, getCssDuration('--nadeneko-sub-message-duration'));
  }, [setSubMessages, deleteSubMessages]);

  // なでる操作時の更新処理
  const petUpdate = useCallback(
    (lotData: NadenekoResponse) => {
      if (dragStateRef.current !== 'standby') return;

      dragCountRef.current = dragCountRef.current - 1;
      subMessageCountRef.current = subMessageCountRef.current - 1;

      // サブメッセージの表示
      if (subMessageCountRef.current <= 0) {
        subMessageCountRef.current = Math.floor(Math.random() * 10) + 10;
        postSubMessages();
      }

      // コインのポップアップ
      if (dragCountRef.current <= 0) {
        dragStateRef.current = 'waiting';

        dragCountRef.current = Math.floor(Math.random() * 5) + 5;

        // なでてメッセージを消す
        setPetMessageClear(true);

        // ポップアップするコインの値段
        const addCoinValue = lotData.addCoins[getCoinIndexRef.current];

        // 更新するコインのインデックス
        const updateCoinIndex = getCoinIndexRef.current % coinPopupElementCount;

        // コインポップアップのCSSを一旦削除
        setCoinClasses((prev) => {
          const newStates = [...prev];
          newStates[updateCoinIndex] = '';
          return newStates;
        });

        // 新しいアニメーションを設定
        setTimeout(() => {
          coinValueRef.current[updateCoinIndex] = addCoinValue;

          // コインポップアップのCSSをセット
          setCoinClasses((prev) => {
            const newStates = [...prev];
            newStates[updateCoinIndex] = `coin--popup`;
            return newStates;
          });

          // コインの位置、大きさを設定
          const randomOffetLeft =
            Math.floor(Math.random() * coinOffsetLeftRange) - coinOffsetLeftRange / 2;
          const randomOffetTop =
            Math.floor(Math.random() * coinOffsetTopRange) - coinOffsetTopRange / 2;
          const rateValue = (() => {
            const rateMap: Record<number, number> = {
              2: 1.0,
              3: 1.2,
              5: 1.5,
              10: 2.0,
              30: 3.0,
            };
            return rateMap[addCoinValue] ?? 1.0;
          })();
          coinPositionRef.current[updateCoinIndex] = {
            left:
              coinBasePositions[randomPositionIndeicesRef.current[updateCoinIndex]].left +
              randomOffetLeft,
            top:
              coinBasePositions[randomPositionIndeicesRef.current[updateCoinIndex]].top +
              randomOffetTop,
            rate: rateValue,
          };

          // 一定期間は待ったあと合計コインを加算
          setTimeout(() => {
            setTotalCoin((prev) => {
              const newTotalCoin = prev + addCoinValue;
              // 念のため
              if (newTotalCoin > lotData.totalAddCoin) {
                return lotData.totalAddCoin;
              }
              return newTotalCoin;
            });
          }, coinAddDelayTime);

          // 一定期間は待った後、待ち状態に戻す
          setTimeout(() => {
            dragStateRef.current = 'standby';
            getCoinIndexRef.current = getCoinIndexRef.current + 1;

            // 全てのコインのポップアップが終わったら完了状態にする
            if (getCoinIndexRef.current >= lotData.addCoins.length) {
              dragStateRef.current = 'finished';
              setScreenClass('animate-nadeneko-screen-finish');
              setPetMessageClear(false);
              setTimeout(() => {
                handleFinished();
              }, finishedTime);
            }
          }, waitTime);
        }, 30);
      }
    },
    [setPetMessageClear, postSubMessages, handleFinished]
  );

  // 自動モードの更新処理
  useEffect(() => {
    const autoUpdate = () => {
      if (isAuto && lotData) {
        petUpdate(lotData);
      }
      requestAnimationFrame(autoUpdate);
    };
    requestAnimationFrame(autoUpdate);
  }, [isAuto, lotData, petUpdate]);

  // ドラッグ中の移動処理
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!lotData) return;
      if (draggingRef.current === false) return;
      if (getCoinIndexRef.current >= lotData.addCoins.length) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      if (targetAreaRef.current && dragStateRef.current === 'standby') {
        const targetArea = targetAreaRef.current.getBoundingClientRect();
        if (
          targetArea.left < clientX &&
          clientX < targetArea.right &&
          targetArea.top < clientY &&
          clientY < targetArea.bottom
        ) {
          petUpdate(lotData);
        }
      }

      startPosRef.current = { x: clientX, y: clientY };
    };

    const handleEnd = () => {
      draggingRef.current = false;
    };

    if (lotData) {
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
    }
  }, [lotData, handleFinished, postSubMessages, petUpdate]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* ドラッグ領域 */}
      <div
        className={
          'absolute max-w-[30rem] min-w-[25rem] w-[100vw] aspect-square bg-[url("/images/nadeneko/nadeneko_action.webp")] bg-[length:100%_auto] bg-no-repeat rounded-md border-4 border-[rgba(40,20,0,0.5)] ' +
          screenClass
        }
        onMouseDown={(e) => handleMouseDown(e)}
        onTouchStart={(e) => handleTouchStart(e)}
        style={{ touchAction: 'none' }}
      >
        {lotData === null ? (
          <div className="absolute top-[15%] left-0 w-full text-center text-white font-bold text-4xl text-shadow-huchi2">
            ロード中
          </div>
        ) : (
          <>
            {/* なでてメッセージ */}
            {petMessage && (
              <div className="absolute top-[15%] left-0 w-full text-center text-white font-bold text-4xl text-shadow-huchi2 animate-nadeneko-pet-message">
                ↓なでて！
              </div>
            )}

            {/* 合計コイン */}
            <div className="absolute top-[4%] left-[4%] w-full text-left text-white font-bold text-4xl text-shadow-huchi2">
              合計：{totalCoin}
            </div>
          </>
        )}

        {/* なでる判定領域 */}
        <div className="absolute top-[26%] left-[26%] w-[48%] h-[68%]" ref={targetAreaRef}></div>

        {/* サブメッセージ */}
        <div className="absolute top-1/2 left-1/2 text-center text-white font-bold text-2xl text-shadow-huchi2 whitespace-nowrap">
          {subMessages.map((subMessage) => (
            <div
              key={`${subMessage.key}`}
              className={`absolute animate-nadeneko-sub-message-${subMessage.animateClassNumber}`}
              style={{ top: `${subMessage.top}rem`, left: `${subMessage.left}rem` }}
            >
              {subMessage.message}
            </div>
          ))}
        </div>

        {/* コインのアニメーション */}
        <div className="absolute w-full h-full">
          {Array.from({ length: coinPopupElementCount }).map((_, index) => (
            <div key={`coin-${index}`}>
              <div
                className="absolute"
                style={{
                  left: `${coinPositionRef.current[index].left}%`,
                  top: `${coinPositionRef.current[index].top}%`,
                  transform: `scale(${coinPositionRef.current[index].rate})`,
                }}
              >
                {/* コインポップアップ */}
                <div className={`nadeneko-coin -translate-x-1/2 ${coinClasses[index]}`}>
                  <p className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-3/5 text-3xl font-bold text-shadow-huchi">
                    {coinValueRef.current[index]}
                  </p>
                </div>
              </div>
              {/* コインの加算エフェクト */}
              {coinClasses[index] !== '' && (
                <div
                  className="nadeneko-coin -translate-x-1/2 nadeneko-coin-total-add"
                  style={{
                    left: `${coinPositionRef.current[index].left}%`,
                    top: `${coinPositionRef.current[index].top}%`,
                    transform: `scale(${coinPositionRef.current[index].rate})`,
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 right-4">
          <Button
            variant="subNatural"
            size="sm"
            onClick={() => setIsAuto(!isAuto)}
            disabled={isAuto || isHelp || lotData === null}
          >
            おまかせ
          </Button>
        </div>

        {/* ヘルプ */}
        <div className="absolute top-4 right-4">
          <Button
            variant="custom"
            className="w-[1.5rem] h-[1.5rem] bg-white disabled:bg-white/50 rounded-full flex items-center justify-center bg-[url('/images/icon/icon_help.webp')] bg-[length:100%_100%] bg-no-repeat"
            onClick={() => {
              setIsHelp(!isHelp);
              console.log('click');
            }}
            disabled={isAuto || isHelp || lotData === null}
          ></Button>
        </div>
        {/* <button
              className="absolute top-[4%] right-[4%] w-[2rem] h-[2rem] rounded-full bg-white/80 flex items-center justify-center"
              onClick={() => {
                setIsHelp(true);
                console.log('click');
              }}
            >
              <Image src="/images/icon/icon_help.webp" alt="ヘルプ" width={48} height={48} />
              あああ
            </button> */}

        <HelpWindow
          isOpen={isHelp}
          className="absolute bg-white rounded-md border-2 border-gray-200 top-12 left-8 right-8"
          handleOutsideClick={() => setIsHelp(false)}
        >
          <NadenekoHelp />
        </HelpWindow>

        {dragStateRef.current === 'finished' && (
          <div className="absolute w-full h-full flex items-center justify-center">
            <div
              className="w-[80%] h-[80%] animate-nadeneko-manzoku"
              style={{
                backgroundImage: `url(/images/nadeneko/nadeneko_manzoku.webp)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
