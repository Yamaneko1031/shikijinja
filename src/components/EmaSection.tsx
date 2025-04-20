'use client';

import { getCssDuration } from '@/utils/getCssDuration';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import TextReveal from './TextReveal';

type TextBlock = {
  text: string;
  font: FontKey;
  fontSize: number;
  fontColor: FontColorKey;
  textRotate: string;
  lineHeight: string;
  offsetX: number;
  offsetY: number;
  textWidth: number;
};

// 絵馬投稿データ
type Post = {
  texts: TextBlock[];
  reply: string;
  emaImage: EmaImageKey;
};

// 絵馬表示用データ
type DisplayPost = Post & {
  drawKey: string;
  rotate: string;
  translateY: string;
  marginRight: string;
  highlighted?: boolean; // ← 追加
};

// 絵馬表示用データを生成
const createDisplayPost = (post: Post): DisplayPost => ({
  ...post,
  drawKey: crypto.randomUUID(),
  rotate: (Math.random() * 10 - 5).toFixed(2),
  translateY: (Math.random() * 10 - 5).toFixed(2),
  marginRight: `${-25 - Math.floor(Math.random() * 20)}px`,
});

// モックデータ作成
const generateMockPosts = (): Post[] => {
  const mockWishesWithResponses = [
    {
      text: '健康に過ごせますように',
      responseText: '日々の穏やかに福あり',
    },
    {
      text: '試験に合格しますように',
      responseText: '知恵の風、汝に届く',
    },
    {
      text: '推しがずっと輝いてますように',
      responseText: '光は絶えぬ、想いの中に',
    },
    {
      text: '仕事がうまくいきますように',
      responseText: '一歩ずつ、道ひらけん',
    },
    {
      text: '世界が平和になりますように',
      responseText: '祈り、空に舞い昇る',
    },
    {
      text: '友達ができますように',
      responseText: '縁は笑顔の先にあり',
    },
    {
      text: 'ゲームがうまくなりますように',
      responseText: '楽しむ心が力となる',
    },
    {
      text: '猫と仲良くなれますように',
      responseText: '優しさは、尾をふる',
    },
    {
      text: '美味しいご飯が食べられますように',
      responseText: 'いただきに感謝を添えて',
    },
    {
      text: '宝くじ当たりますように',
      responseText: '運は巡る、静かに待て',
    },
  ];

  return mockWishesWithResponses.map(({ text, responseText }) => {
    const font = ['ackaisyo', 'aoyagi', 'otsutome', 'yusei'][
      Math.floor(Math.random() * 4)
    ] as FontKey;
    const fontColor = ['black', 'red', 'blue', 'green'][
      Math.floor(Math.random() * 4)
    ] as FontColorKey;
    const fontSize = 24;
    const lineHeight = (Math.random() * 0.2 + 1.2).toFixed(1);
    const textRotate = (Math.random() * 6 - 3).toFixed(1);

    const textBlock: TextBlock = {
      text,
      font,
      fontSize,
      fontColor,
      textRotate,
      lineHeight,
      offsetX: 0,
      offsetY: 0,
      textWidth: defaultTextRectSize.width,
    };

    return {
      texts: [textBlock],
      reply: responseText,
      emaImage: ['iroha', 'nadeneko', 'shikineko', 'tenten'][
        Math.floor(Math.random() * 4)
      ] as EmaImageKey,
    };
  });
};

// フォントテーブル
const fontList = [
  { key: 'ackaisyo', label: '英椎楷書', className: 'font-ackaisyo' },
  { key: 'aoyagi', label: '青柳衡山', className: 'font-aoyagi' },
  { key: 'otsutome', label: 'おつとめフォント', className: 'font-otsutome' },
  { key: 'yusei', label: 'Yusei Magic', className: 'font-yusei' },
] as const;

type FontListItem = (typeof fontList)[number];
type FontKey = FontListItem['key'];

// フォントカラーテーブル
const fontColorList = [
  { key: 'black', label: '黒', value: '#0c0c0c' },
  { key: 'red', label: '赤', value: '#B90000' },
  { key: 'blue', label: '青', value: '#183B80' },
  { key: 'green', label: '緑', value: '#0A672C' },
] as const;

type FontColorListItem = (typeof fontColorList)[number];
type FontColorKey = FontColorListItem['key'];

// 絵馬背景テーブル
const emaList = {
  shikineko: {
    label: 'しきねこ',
    filename: 'ema_shikineko.webp',
    illustname: 'illust_shikineko.webp',
    grace: '主にエンジニア業務における\nご利益があるとされている',
  },
  iroha: {
    label: 'いろは',
    filename: 'ema_iroha.webp',
    illustname: 'illust_iroha.webp',
    grace: '主にデザイン業務における\nご利益があるとされている',
  },
  tenten: {
    label: 'てんてん',
    filename: 'ema_tenten.webp',
    illustname: 'illust_tenten.webp',
    grace: '主にPM業務における\nご利益があるとされている',
  },
  nadeneko: {
    label: 'なでねこ',
    filename: 'ema_nadeneko.webp',
    illustname: 'illust_nadeneko.webp',
    grace: '撫でられると喜ぶ\n心身快癒を招くとされている',
  },
} as const;

type EmaImageKey = keyof typeof emaList;

const fontSizePxRange = {
  min: 14,
  max: 32,
};

const defaultTextRectSize = {
  top: 110,
  left: 35,
  width: 170,
  height: 100,
};

const defaultOffsetPos = [
  {
    offsetX: 0,
    offsetY: 0,
  },
  {
    offsetX: 0,
    offsetY: 35,
  },
];

const EmaSection = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const previewTextRef = useRef<HTMLParagraphElement>(null);
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  const previewTextRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const [displayPosts, setDisplayPosts] = useState<DisplayPost[]>([]);
  const [selectedDeity, setSelectedDeity] = useState<EmaImageKey | null>(null);
  const [emaImage, setEmaImage] = useState<EmaImageKey>('iroha');
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [showPostedMessage, setShowPostedMessage] = useState(false);
  const [popupMap, setPopupMap] = useState<Record<string, boolean>>({});
  const [bounceMap, setBounceMap] = useState<Record<string, boolean>>({});
  const popupTimerMap = useRef<Record<string, ReturnType<typeof setTimeout> | undefined>>({});
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  const [currentTextIndex, setCurrentTextIndex] = useState<0 | 1>(0);
  const [texts, setTexts] = useState<TextBlock[]>([
    {
      text: '',
      font: 'ackaisyo',
      fontSize: 24,
      fontColor: 'black',
      textRotate: '0',
      lineHeight: '1.4',
      offsetX: 0,
      offsetY: 0,
      textWidth: defaultTextRectSize.width,
    },
    {
      text: '',
      font: 'ackaisyo',
      fontSize: 24,
      fontColor: 'black',
      textRotate: '0',
      lineHeight: '1.4',
      offsetX: 0,
      offsetY: 0,
      textWidth: defaultTextRectSize.width,
    },
  ]);

  const updateCurrentText = useCallback(
    (patch: Partial<TextBlock> | ((prev: TextBlock) => TextBlock)) => {
      setTexts((prev) => {
        const updated = [...prev];
        const prevBlock = updated[currentTextIndex];

        updated[currentTextIndex] =
          typeof patch === 'function' ? patch(prevBlock) : { ...prevBlock, ...patch };

        return updated;
      });
    },
    [currentTextIndex]
  );

  const handleTap = (key: string) => {
    const popupDuration = getCssDuration('--ema-popup-duration');
    const bounceDuration = getCssDuration('--ema-bounce-duration');

    // --- ポップアップ ---
    setPopupMap((prev) => ({ ...prev, [key]: false }));
    setTimeout(() => {
      setPopupMap((prev) => ({ ...prev, [key]: true }));
    }, 10);

    // 前のタイマーがあればキャンセル
    if (popupTimerMap.current[key]) {
      clearTimeout(popupTimerMap.current[key]);
    }

    // 新しいタイマーをセットして記録
    const newPopupTimer = setTimeout(() => {
      setPopupMap((prev) => ({ ...prev, [key]: false }));
      popupTimerMap.current[key] = undefined;
    }, popupDuration);
    popupTimerMap.current[key] = newPopupTimer;

    // --- バウンス ---
    setBounceMap((prev) => ({ ...prev, [key]: false }));
    setTimeout(() => {
      setBounceMap((prev) => ({ ...prev, [key]: true }));
    }, 10);

    setTimeout(() => {
      setBounceMap((prev) => ({ ...prev, [key]: false }));
    }, bounceDuration + 10);
  };

  const [textRectStyle, setTextRectStyle] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const draggingRef = useRef<number | false>(false);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (draggingRef.current === false) return;

      const index = draggingRef.current;

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      const dx = clientX - startPosRef.current.x;
      const dy = clientY - startPosRef.current.y;

      setTexts((prev) => {
        const updated = [...prev];
        const target = updated[index];
        updated[index] = {
          ...target,
          offsetX: target.offsetX + dx,
          offsetY: target.offsetY + dy,
        };
        return updated;
      });

      startPosRef.current = { x: clientX, y: clientY };
    };

    const handleEnd = () => {
      draggingRef.current = false;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [updateCurrentText]);

  const scrollToCarousel = () => {
    if (!carouselRef.current) return;

    const offsetTop =
      carouselRef.current.getBoundingClientRect().top +
      window.scrollY +
      carouselRef.current.offsetHeight / 2;
    const targetY = offsetTop - window.innerHeight / 2; // 端末の高さ/2分上に余白を空けたい

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
  const handlePostWish = () => {
    if (!texts[currentTextIndex].text.trim()) return;

    const container = previewContainerRef.current;
    const text = previewTextRef.current;

    if (container && text) {
      if (isOverflowing) {
        alert('文字が絵馬からはみ出しています。位置や角度、行間を調整してください。');
        return;
      }
    }

    const newPost: Post = {
      texts: texts,
      reply: '返信待ち',
      emaImage,
    };

    const insertIndex = getInsertIndex();
    const newDisplayPost = {
      ...createDisplayPost(newPost),
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

    // 入力内容リセット
    setTexts([
      {
        text: '',
        font: 'ackaisyo',
        fontSize: 24,
        fontColor: 'black',
        textRotate: '0',
        lineHeight: '1.4',
        offsetX: 0,
        offsetY: 0,
        textWidth: defaultTextRectSize.width,
      },
      {
        text: '',
        font: 'ackaisyo',
        fontSize: 24,
        fontColor: 'black',
        textRotate: '0',
        lineHeight: '1.4',
        offsetX: 0,
        offsetY: 0,
        textWidth: defaultTextRectSize.width,
      },
    ]);
    setEmaImage('iroha');
    setIsPosting(false);
    setCurrentTextIndex(0);

    // 投稿メッセージ表示
    setShowPostedMessage(true);

    const fadeInOutDuration = getCssDuration('--ema-animate-fade-in-out-duration');
    setTimeout(() => setShowPostedMessage(false), fadeInOutDuration);

    // 絵馬投稿後にスクロール
    scrollToCarousel();
  };

  // 初期データをセット（モック）
  useEffect(() => {
    const mockPosts = generateMockPosts().map(createDisplayPost);
    setDisplayPosts(mockPosts);
  }, []);

  // 自動スクロール処理
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        // scrollByだとiOSで表示が再描画されないことがあるので、scrollToを使用
        carouselRef.current.scrollTo({
          left: carouselRef.current.scrollLeft + 2,
          behavior: 'auto',
        });

        const container = carouselRef.current;
        if (!container) return;

        const scrollLeft = container.scrollLeft;
        const scrollWidth = container.scrollWidth;
        const middleX = scrollWidth / 2;

        if (scrollLeft > middleX) {
          const shiftWidth = Array.from(container.children)
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

          // requestAnimationFrameでDOM更新の次のフレームでスクロール補正
          requestAnimationFrame(() => {
            container.scrollLeft -= shiftWidth;
          });
        }
      }
    }, 60);

    return () => clearInterval(interval);
  }, []);

  // テキストのはみ出しをチェック
  const checkTextOverflowAndRect = useCallback(() => {
    const textEl = previewTextRefs.current[currentTextIndex];
    if (!textEl || !previewWrapperRef.current || !previewContainerRef.current) return;

    const textRect = textEl.getBoundingClientRect();
    const wrapperRect = previewWrapperRef.current.getBoundingClientRect();
    const containerRect = previewContainerRef.current.getBoundingClientRect();

    setTextRectStyle({
      top: textRect.top - wrapperRect.top,
      left: textRect.left - wrapperRect.left,
      width: textRect.width,
      height: textRect.height,
    });

    const margin = 5;
    const isOver =
      textRect.left < containerRect.left - margin ||
      textRect.top < containerRect.top - margin ||
      textRect.right > containerRect.right + margin ||
      textRect.bottom > containerRect.bottom + margin;

    setIsOverflowing(isOver);
  }, [currentTextIndex]);

  const currentText = texts[currentTextIndex];
  useEffect(() => {
    checkTextOverflowAndRect();
  }, [currentText, currentTextIndex, selectedDeity, checkTextOverflowAndRect]);

  useEffect(() => {
    if (isPosting) {
      document.body.style.overflow = 'hidden';

      const initFont = ['ackaisyo', 'aoyagi', 'otsutome', 'yusei'][
        Math.floor(Math.random() * 4)
      ] as FontKey;
      const initFontColor = ['black', 'red', 'blue', 'green'][
        Math.floor(Math.random() * 4)
      ] as FontColorKey;
      // 投稿フォームが開かれたタイミングでランダム初期化
      setTexts([
        {
          text: '',
          font: initFont,
          fontSize: 24,
          fontColor: initFontColor,
          textRotate: '0',
          lineHeight: [1.0, 1.1, 1.2, 1.3, 1.4][Math.floor(Math.random() * 5)].toFixed(1),
          offsetX: 0,
          offsetY: 0,
          textWidth: defaultTextRectSize.width,
        },
        {
          text: '',
          font: initFont,
          fontSize: 16,
          fontColor: initFontColor,
          textRotate: '0',
          lineHeight: '1.4',
          offsetX: 0,
          offsetY: 35,
          textWidth: defaultTextRectSize.width,
        },
      ]);
      setCurrentTextIndex(0);

      // 投稿を開いた時にスクロール
      scrollToCarousel();
      // 投稿を開いた時に表示位置のチェック
      setTimeout(checkTextOverflowAndRect, 0);
    } else {
      document.body.style.overflow = '';
    }

    // クリーンアップ（万が一の保険）
    return () => {
      document.body.style.overflow = '';
    };
  }, [isPosting, checkTextOverflowAndRect]);

  return (
    <div className="relative w-full h-[1200px] items-center justify-center p-4">
      <div className="relative top-[400px] w-full max-w-3xl mx-auto p-4 bg-black/50 bg-opacity-80 rounded shadow-lg">
        <TextReveal
          text="絵馬投稿や他の人の投稿した絵馬をみるコンテンツ"
          delayPerChar={0.1}
          className="text-2xl font-bold mb-4"
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
        <div className="overflow-hidden">
          <div
            ref={carouselRef}
            className="flex whitespace-nowrap overflow-x-auto overflow-y-hidden no-scrollbar"
          >
            {displayPosts.map((displayPost: DisplayPost) => {
              return (
                <div
                  key={displayPost.drawKey}
                  className="min-w-[240px] h-[240px] relative text-center"
                  style={{
                    marginRight: displayPost.marginRight,
                  }}
                  onClick={() => handleTap(displayPost.drawKey)}
                >
                  {/* ✅ ポップアップ（絵馬本体とは別に表示） */}
                  {popupMap[displayPost.drawKey] && (
                    <div className="absolute top-10 left-1/2 z-50 animate-ema-popup">
                      <div className="w-[200px] bg-black/70 backdrop-blur-sm text-sm text-w-800 px-3 py-2 rounded shadow-lg text-center break-words whitespace-pre-wrap select-none">
                        {displayPost.reply}
                      </div>
                    </div>
                  )}

                  {/* ✅ 絵馬本体（ここだけバウンス） */}
                  <div
                    className={`
              w-full h-full bg-cover bg-center bg-no-repeat
              ${displayPost.highlighted ? 'animate-ema-insert' : ''}
              ${bounceMap[displayPost.drawKey] ? 'animate-ema-bounce' : ''}
            `}
                    style={
                      {
                        backgroundImage: `url(/images/ema/${emaList[displayPost.emaImage].filename})`,
                        '--rotate': `${displayPost.rotate}deg`,
                        '--ty': `${displayPost.translateY}px`,
                        transform: `rotate(var(--rotate)) translateY(var(--ty)) scale(1)`,
                      } as React.CSSProperties
                    }
                  >
                    {/* 絵馬の文字 */}
                    <div
                      className="absolute flex items-center justify-center overflow-hidden"
                      style={{
                        top: `${defaultTextRectSize.top}px`,
                        left: `${defaultTextRectSize.left}px`,
                        width: `${defaultTextRectSize.width}px`,
                        height: `${defaultTextRectSize.height}px`,
                      }}
                    >
                      {displayPost.texts.map((block, i) => (
                        <p
                          key={i}
                          className={`absolute ${fontList.find((f) => f.key === block.font)?.className} text-center whitespace-pre-wrap text-shadow select-none`}
                          style={{
                            maxWidth: `${block.textWidth}px`,
                            color: fontColorList.find((c) => c.key === block.fontColor)?.value,
                            transform: `translate(${block.offsetX}px, ${block.offsetY}px) rotate(${block.textRotate}deg)`,
                            touchAction: 'none',
                            lineHeight: block.lineHeight,
                            fontSize: `${block.fontSize}px`,
                          }}
                        >
                          {block.text}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {!isPosting && (
          <button
            onClick={() => {
              setSelectedDeity(null);
              setIsPosting(true);
            }}
            className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 mb-4"
          >
            絵馬に願いを書く
          </button>
        )}

        {isPosting && (
          <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center p-4">
            {selectedDeity === null ? (
              // 神様選択フェーズ
              <div className="flex flex-col gap-4 items-center bg-black/80 rounded-lg p-2 max-w-[400px] min-w-[320px] w-full shadow-xl relative text-white">
                <h2 className="text-xl font-bold mb-4">どの神様に願いを届けますか？</h2>
                <div className="flex flex-col gap-4 w-full max-w-xs">
                  {Object.entries(emaList).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedDeity(key as EmaImageKey);
                        setEmaImage(key as EmaImageKey);
                        setIsPosting(true);
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 text-left text-white"
                    >
                      <div className="w-[64px] h-[64px] rounded-md overflow-hidden shrink-0">
                        <Image
                          src={`/images/illust/${data.illustname}`}
                          alt={data.label}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col text-sm whitespace-pre-line">
                        <div className="font-bold text-base">{data.label}</div>
                        <div className="text-gray-300">{data.grace}</div>
                      </div>
                    </button>
                  ))}
                </div>
                {/* 閉じるボタン */}
                <button
                  onClick={() => {
                    setSelectedDeity(null);
                    setIsPosting(false);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded"
                >
                  閉じる
                </button>
              </div>
            ) : (
              <div className="bg-black/80 rounded-lg p-2 max-w-[400px] min-w-[320px] w-full shadow-xl relative text-white">
                {/* 挿絵・説明 */}
                <div className="relative flex items-center gap-2 bg-black/10 p-2 rounded border border-white h-[90px]">
                  <button
                    onClick={() =>
                      setEmaImage((prev) => {
                        const keys = Object.keys(emaList);
                        const currentIndex = keys.indexOf(prev);
                        const prevIndex = (currentIndex - 1 + keys.length) % keys.length;
                        return keys[prevIndex] as EmaImageKey;
                      })
                    }
                    className="w-[30px] h-[30px] px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-full shadow-md z-50 flex items-center justify-center"
                  >
                    {'←'}
                  </button>
                  <div className="flex items-center gap-3 flex-1 overflow-hidden">
                    <div className="w-[80px] h-[80px] rounded-md overflow-hidden shrink-0">
                      <Image
                        src={`/images/illust/${emaList[emaImage].illustname}`}
                        alt=""
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-white">【{emaList[emaImage].label}】</div>
                      <div className="text-xs text-gray-300 ml-1 whitespace-pre-line text-center">
                        {emaList[emaImage].grace}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setEmaImage((prev) => {
                        const keys = Object.keys(emaList);
                        const currentIndex = keys.indexOf(prev);
                        const nextIndex = (currentIndex + 1) % keys.length;
                        return keys[nextIndex] as EmaImageKey;
                      })
                    }
                    className="w-[30px] h-[30px] px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-full shadow-md z-50 flex items-center justify-center"
                  >
                    {'→'}
                  </button>
                </div>

                {/* 絵馬プレビュー＆テキストエリア + 設定UI ラッパー */}
                <div className="relative flex justify-center w-full">
                  <button
                    onClick={() => setIsSettingOpen(!isSettingOpen)}
                    className="absolute left-2 top-2 px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-full shadow-md z-50 flex items-center"
                  >
                    <Image
                      src="/images/icon/icon_hude.webp"
                      alt="icon"
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    {isSettingOpen ? '←' : '文字のカスタム'}
                  </button>

                  {/* 編集対象テキストの選択 */}
                  <div className="absolute right-2 top-2 flex flex-col gap-2 z-20">
                    {[0, 1].map((index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTextIndex(index as 0 | 1)}
                        className={`px-2 py-1 rounded-full border ${
                          currentTextIndex === index
                            ? 'bg-white/20 text-white border-white'
                            : 'bg-white/10 hover:bg-white/20 text-white/50 border-0'
                        }`}
                      >
                        {index === 0 ? '本文' : 'ニックネーム'}
                      </button>
                    ))}
                  </div>

                  {/* 開閉式設定UI（左側、プレビューより前面に） */}
                  <div
                    className={`
                  absolute top-46 left-0 -translate-y-1/2 z-50
                  bg-black/90 text-white rounded-r-lg shadow-lg
                  transition-all duration-300 ease-in-out
                  ${isSettingOpen ? 'w-[120px] opacity-100' : 'w-[24px] opacity-60'}
                `}
                  >
                    {isSettingOpen && (
                      <div className="px-2 text-sm space-y-2 w-[120px]">
                        <div>
                          <label>フォント</label>
                          <select
                            value={currentText.font}
                            onChange={(e) => updateCurrentText({ font: e.target.value as FontKey })}
                            className="w-full bg-black border border-white rounded px-1"
                          >
                            {fontList.map((f) => (
                              <option key={f.key} value={f.key}>
                                {f.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label>文字色</label>
                          <div className="flex gap-1 mt-1">
                            {fontColorList.map(({ key, value }) => (
                              <button
                                key={key}
                                className={`w-4 h-4 rounded-full border-2 ${
                                  currentText.fontColor === key
                                    ? 'border-white'
                                    : 'border-transparent'
                                }`}
                                style={{ backgroundColor: value }}
                                onClick={() => updateCurrentText({ fontColor: key })}
                                title={key}
                              />
                            ))}
                          </div>
                        </div>

                        <div>
                          <label>サイズ</label>
                          <input
                            type="range"
                            min={fontSizePxRange.min}
                            max={fontSizePxRange.max}
                            step={1}
                            value={currentText.fontSize}
                            onChange={(e) =>
                              updateCurrentText({ fontSize: Number(e.target.value) })
                            }
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label>角度</label>
                          <input
                            type="range"
                            min={-10}
                            max={10}
                            step={1}
                            value={currentText.textRotate}
                            onChange={(e) => updateCurrentText({ textRotate: e.target.value })}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label>行間</label>
                          <input
                            type="range"
                            min={1.0}
                            max={2.0}
                            step={0.1}
                            value={currentText.lineHeight}
                            onChange={(e) => updateCurrentText({ lineHeight: e.target.value })}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label>最大幅</label>
                          <input
                            type="range"
                            min={80}
                            max={defaultTextRectSize.width}
                            step={5}
                            value={currentText.textWidth}
                            onChange={(e) =>
                              updateCurrentText({ textWidth: Number(e.target.value) })
                            }
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative z-10">
                    {/* 右にずらされるプレビュー */}
                    <div
                      className={`
                    relative z-10 transition-all duration-300
                    ${isSettingOpen ? 'ml-[90px]' : 'ml-[24px]'}
                  `}
                    >
                      {/* 絵馬プレビュー＆テキストエリア */}
                      <div className="flex flex-col items-center">
                        <div
                          ref={previewWrapperRef}
                          className="relative w-[240px] min-w-[240px] h-[240px] bg-cover bg-center bg-no-repeat"
                          style={{
                            backgroundImage: `url(/images/ema/${emaList[emaImage].filename})`,
                          }}
                        >
                          <div
                            ref={previewContainerRef}
                            className="absolute flex items-center justify-center overflow-hidden"
                            style={{
                              top: `${defaultTextRectSize.top}px`,
                              left: `${defaultTextRectSize.left}px`,
                              width: `${defaultTextRectSize.width}px`,
                              height: `${defaultTextRectSize.height}px`,
                            }}
                          >
                            {texts.map((block, index) => {
                              const isCurrent = currentTextIndex === index;
                              const isEmpty = block.text === '';
                              const placeholder = 'ここに表示される';
                              // 空かつ非アクティブなら描画しない
                              if (isEmpty && !isCurrent) return null;

                              return (
                                <p
                                  key={index}
                                  ref={(el) => {
                                    previewTextRefs.current[index] = el;
                                  }}
                                  onMouseDown={(e) => {
                                    setCurrentTextIndex(index as 0 | 1);
                                    draggingRef.current = index;
                                    startPosRef.current = { x: e.clientX, y: e.clientY };
                                  }}
                                  onTouchStart={(e) => {
                                    setCurrentTextIndex(index as 0 | 1);
                                    const touch = e.touches[0];
                                    draggingRef.current = index;
                                    startPosRef.current = { x: touch.clientX, y: touch.clientY };
                                  }}
                                  className={`absolute ${fontList.find((f) => f.key === block.font)?.className} text-center whitespace-pre-wrap text-shadow select-none`}
                                  style={{
                                    maxWidth: `${block.textWidth}px`,
                                    color: fontColorList.find((c) => c.key === block.fontColor)
                                      ?.value,
                                    transform: `translate(${block.offsetX}px, ${block.offsetY}px) rotate(${block.textRotate}deg)`,
                                    touchAction: 'none',
                                    lineHeight: block.lineHeight,
                                    fontSize: `${block.fontSize}px`,
                                  }}
                                >
                                  {isEmpty ? placeholder : block.text}
                                </p>
                              );
                            })}
                          </div>
                          {/* バリデーション用の境界線 */}
                          <div
                            className="absolute border border-yellow-400 rounded"
                            style={{
                              top: `${defaultTextRectSize.top}px`,
                              left: `${defaultTextRectSize.left}px`,
                              width: `${defaultTextRectSize.width}px`,
                              height: `${defaultTextRectSize.height}px`,
                              pointerEvents: 'none',
                            }}
                          ></div>
                          {/* ガイド枠（はみ出しチェック用） */}
                          {textRectStyle && (
                            <div
                              className="absolute pointer-events-none z-50"
                              style={{
                                top: `${textRectStyle.top}px`,
                                left: `${textRectStyle.left}px`,
                                width: `${textRectStyle.width}px`,
                                height: `${textRectStyle.height}px`,
                                border: `2px dashed ${isOverflowing ? 'red' : 'lime'}`,
                                borderRadius: '4px',
                              }}
                            />
                          )}
                        </div>
                        <textarea
                          maxLength={40}
                          rows={3}
                          value={currentText.text}
                          onChange={(e) => updateCurrentText({ text: e.target.value })}
                          className="w-[200px] max-w-md p-2 border rounded bg-black/20 hover:bg-black/40 mt-[-10px]"
                          placeholder="願い事を入力..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1 mt-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsPosting(false)}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded"
                    >
                      閉じる
                    </button>
                    <button
                      onClick={handlePostWish}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded"
                    >
                      投稿する
                    </button>
                    <button
                      onClick={() =>
                        updateCurrentText({
                          offsetX: defaultOffsetPos[currentTextIndex].offsetX,
                          offsetY: defaultOffsetPos[currentTextIndex].offsetY,
                        })
                      }
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded"
                    >
                      位置リセット
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmaSection;
