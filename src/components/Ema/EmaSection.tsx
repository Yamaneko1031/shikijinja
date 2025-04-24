'use client';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import useSWR from 'swr';
import TextReveal from '@/components/shared/TextReveal';
import { getCssDuration } from '@/utils/getCssDuration';
import { Post, DisplayPost, EmaImageKey } from '@/types/ema';

import EmaItem from './EmaItem';
import EmaForm from './EmaForm';
import DeitySelector from './DeitySelector';
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// 絵馬表示用データを生成
const createDisplayPost = (post: Post): DisplayPost => ({
  ...post,
  drawKey: crypto.randomUUID(),
  rotate: (Math.random() * 10 - 5).toFixed(2),
  translateY: (Math.random() * 10 - 5).toFixed(2),
  marginRight: `${-25 - Math.floor(Math.random() * 20)}px`,
});

const EmaSection = () => {
  const {
    data: emaData,
    error: emaGetError,
    isLoading: isEmaLoading,
  } = useSWR('/api/get-ema', fetcher);

  const isTouchingRef = useRef(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollShiftRef = useRef<number>(0);
  const scrollLeftPrev = useRef(0);
  const scrollLeftLoopStopCount = useRef(0);
  const [displayPosts, setDisplayPosts] = useState<DisplayPost[]>([]);
  const [selectedDeity, setSelectedDeity] = useState<EmaImageKey | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [showPostedMessage, setShowPostedMessage] = useState(false);

  // 絵馬投稿セクションにスクロール
  const scrollToEmaSection = () => {
    if (!carouselRef.current) return;

    const offsetTop =
      carouselRef.current.getBoundingClientRect().top +
      window.scrollY +
      carouselRef.current.offsetHeight / 2;
    const targetY = offsetTop - window.innerHeight / 2;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  };

  // 絵馬投稿位置を取得
  const getInsertIndex = () => {
    if (!carouselRef.current) return displayPosts.length;

    const container = carouselRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.offsetWidth;

    // 中央位置
    const center = scrollLeft + containerWidth / 2;

    let total = 0;
    for (let i = 0; i < container.children.length; i++) {
      const child = container.children[i] as HTMLElement;
      const width = child.offsetWidth;
      const margin = parseFloat(getComputedStyle(child).marginRight);
      total += width + margin;
      if (total > center) return i;
    }

    return displayPosts.length;
  };

  // 絵馬投稿処理
  const handlePostWish = (post: Post) => {
    scrollToEmaSection();

    const insertIndex = getInsertIndex();
    const newDisplayPost = {
      ...createDisplayPost(post),
      highlighted: true,
    };

    setDisplayPosts((prev) => {
      const next = [...prev];
      next.splice(insertIndex, 0, newDisplayPost);
      return next;
    });

    const insertDuration = getCssDuration('--ema-insert-duration');
    // 挿入アニメーションの付けはずし
    setTimeout(() => {
      setDisplayPosts((prev) =>
        prev.map((p) => (p.drawKey === newDisplayPost.drawKey ? { ...p, highlighted: false } : p))
      );
    }, insertDuration);

    setIsPosting(false);

    // 投稿メッセージ表示
    setShowPostedMessage(true);

    const fadeInOutDuration = getCssDuration('--ema-animate-fade-in-out-duration');
    setTimeout(() => setShowPostedMessage(false), fadeInOutDuration);

    // 保存は非同期
    fetch('/api/post-ema', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    }).catch((error) => {
      console.error('保存に失敗しました:', error);
    });
  };

  // データ取得後に displayPost に変換してセット
  useEffect(() => {
    if (emaData?.success && emaData.posts) {
      const display = emaData.posts.map(createDisplayPost);
      setDisplayPosts(display);
    }
  }, [emaData]);

  // カルーセルの自動スクロール処理
  useEffect(() => {
    const interval = setInterval(() => {
      const container = carouselRef.current;
      if (container) {
        // タッチ中ならスクロールしない
        if (!isTouchingRef.current) {
          if (container.scrollLeft == scrollLeftPrev.current) {
            if (scrollLeftLoopStopCount.current > 0) {
              scrollLeftLoopStopCount.current--;
            } else {
              // 自動スクロール
              // scrollByだとiOSで表示が再描画されないことがあるので、scrollToを使用
              container.scrollTo({
                left: container.scrollLeft + 2,
                behavior: 'auto',
              });

              if (container.children.length < 10) return;
              const fifthChild = container.children[6] as HTMLElement;
              const fifthChildLeft = fifthChild.getBoundingClientRect().left;

              if (fifthChildLeft < window.innerWidth / 2) {
                scrollShiftRef.current = Array.from(container.children)
                  .slice(0, 3)
                  .reduce((acc, child) => {
                    const childElement = child as HTMLElement;
                    const width = childElement.offsetWidth;
                    const margin = parseFloat(getComputedStyle(childElement).marginRight);
                    return acc + width + margin;
                  }, 0);

                setDisplayPosts((prev) => {
                  const moved = prev.slice(0, 3);
                  const rest = prev.slice(3);
                  return [...rest, ...moved];
                });
              }
            }
          }
          scrollLeftPrev.current = container.scrollLeft;
        }
      }
    }, 60);

    return () => clearInterval(interval);
  }, []);

  // displayPosts更新時にスクロール補正が必要なら補正
  useLayoutEffect(() => {
    if (scrollShiftRef.current && carouselRef.current) {
      carouselRef.current.scrollLeft -= scrollShiftRef.current;
      scrollShiftRef.current = 0;
    }
  }, [displayPosts]);

  return (
    <div className="relative w-full h-[1200px] items-center justify-center p-4">
      <div className="relative top-[400px] w-full max-w-3xl mx-auto p-4 bg-black/50 bg-opacity-80 rounded shadow-lg">
        <TextReveal
          text="絵馬投稿や他の人の投稿した絵馬をみるコンテンツ"
          delayPerChar={0.1}
          className="text-2xl font-bold"
        />

        {/* 投稿メッセージ表示 */}
        {showPostedMessage && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-black/60 text-white text-lg px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
              絵馬を投稿しました！
            </div>
          </div>
        )}

        {/* 絵馬一覧カルーセル表示 */}
        <div
          className="overflow-hidden bg-cover bg-center rounded-lg border-4 border-[rgba(40,20,0,0.5)]"
          style={{ backgroundImage: 'url(/images/ema/bg_ema_view.webp)' }}
        >
          {isEmaLoading ? (
            <div>読み込み中...</div>
          ) : emaGetError ? (
            <div>データの取得に失敗しました</div>
          ) : (
            <div
              ref={carouselRef}
              onTouchStart={() => {
                isTouchingRef.current = true;
                scrollLeftLoopStopCount.current = 3;
              }}
              onTouchEnd={() => (isTouchingRef.current = false)}
              onTouchCancel={() => (isTouchingRef.current = false)}
              className="flex whitespace-nowrap overflow-x-auto overflow-y-hidden no-scrollbar"
            >
              {displayPosts.map((displayPost: DisplayPost) => {
                return <EmaItem key={displayPost.drawKey} post={displayPost} />;
              })}
            </div>
          )}
        </div>

        <button
          onClick={() => {
            setSelectedDeity(null);
            scrollToEmaSection();
            setIsPosting(true);
          }}
          className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 mb-4"
        >
          絵馬に願いを書く
        </button>

        {isPosting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {selectedDeity === null ? (
              // 神様選択フェーズ
              <DeitySelector
                onSelect={(key) => {
                  setSelectedDeity(key);
                  setIsPosting(true);
                }}
                onCancel={() => {
                  setSelectedDeity(null);
                  setIsPosting(false);
                }}
              />
            ) : (
              // 絵馬投稿フォーム
              <EmaForm
                initialDeityKey={selectedDeity}
                onSubmit={handlePostWish}
                onClose={() => setIsPosting(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmaSection;
