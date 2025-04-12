'use client';

import { useState, useEffect, useRef } from 'react';

// 絵馬投稿データ
type Post = {
  text: string;
  font: FontKey;
  fontSize: FontSize;
  fontColor: FontColorKey;
  emaImage: EmaImageKey;
};

// 絵馬表示用データ
type DisplayPost = Post & {
  rotate: string;
  translateY: string;
  marginRight: string;
};

// 絵馬表示用データを生成
const createDisplayPost = (post: Post): DisplayPost => ({
  ...post,
  rotate: (Math.random() * 10 - 5).toFixed(2),
  translateY: (Math.random() * 10 - 5).toFixed(2),
  marginRight: `${-10 - Math.floor(Math.random() * 20)}px`,
});

// モックデータ作成
const generateMockPosts = (): Post[] => {
  const texts = [
    '健康に過ごせますように',
    '試験に合格しますように',
    '推しがずっと輝いてますように',
    '仕事がうまくいきますように',
    '世界が平和になりますように',
    '友達ができますように',
    'ゲームがうまくなりますように',
    '猫と仲良くなれますように',
    '美味しいご飯が食べられますように',
    '宝くじ当たりますように',
  ];

  return texts.map((text) => ({
    text,
    font: ['ackaisyo', 'aoyagi', 'otsutome'][Math.floor(Math.random() * 3)] as FontKey,
    fontSize: ['small', 'medium', 'large'][Math.floor(Math.random() * 3)] as FontSize,
    fontColor: ['black', 'red', 'blue', 'green'][Math.floor(Math.random() * 4)] as FontColorKey,
    emaImage: ['iroha', 'nadeneko', 'shikineko', 'tenten'][
      Math.floor(Math.random() * 4)
    ] as EmaImageKey,
  }));
};

// フォントテーブル
const fontList = [
  { key: 'ackaisyo', label: '英椎楷書', className: 'font-ackaisyo' },
  { key: 'aoyagi', label: '青柳衡山', className: 'font-aoyagi' },
  { key: 'otsutome', label: 'おつとめフォント', className: 'font-otsutome' },
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

// フォントサイズテーブル
const fontSizeList = [
  { key: 'small', label: '小' },
  { key: 'medium', label: '中' },
  { key: 'large', label: '大' },
] as const;

type FontSizeListItem = (typeof fontSizeList)[number];
type FontSize = FontSizeListItem['key'];

// 絵馬背景テーブル
const emaList = [
  { key: 'iroha', label: 'いろは', filename: 'ema_iroha.webp' },
  { key: 'nadeneko', label: 'なでねこ', filename: 'ema_nadeneko.webp' },
  { key: 'shikineko', label: 'しきねこ', filename: 'ema_shikineko.webp' },
  { key: 'tenten', label: 'てんてん', filename: 'ema_tenten.webp' },
] as const;

type EmaListItem = (typeof emaList)[number];
type EmaImageKey = EmaListItem['key'];

type FontSizeStyle = {
  className: string;
  top: string;
  left: string;
  width: string;
  height: string;
};

// フォントサイズに応じた絵馬上のスタイルテーブル
const fontSizeMap: Record<FontSize, FontSizeStyle> = {
  small: {
    className: 'text-[17px]',
    top: '110px',
    left: '35px',
    width: '170px',
    height: '100px',
  },
  medium: {
    className: 'text-[24px]',
    top: '105px',
    left: '35px',
    width: '170px',
    height: '110px',
  },
  large: {
    className: 'text-[32px]',
    top: '115px',
    left: '35px',
    width: '170px',
    height: '100px',
  },
};

const EmaSection = () => {
  const [wish, setWish] = useState('');
  const [displayPosts, setDisplayPosts] = useState<DisplayPost[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  const [emaImage, setEmaImage] = useState<EmaImageKey>('iroha');
  const [font, setFont] = useState<FontKey>('ackaisyo');
  const [fontColor, setFontColor] = useState<FontColorKey>('black');
  const [fontSize, setFontSize] = useState<FontSize>('medium');

  // 絵馬投稿処理
  const handlePostWish = () => {
    if (!wish.trim()) return;
    const newPost: Post = { text: wish, font, fontSize, fontColor, emaImage };
    setDisplayPosts((prev) => [...prev, createDisplayPost(newPost)]);
    setWish('');
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
        carouselRef.current.scrollBy({ left: 2, behavior: 'auto' });
        if (
          carouselRef.current.scrollLeft >=
          carouselRef.current.scrollWidth - carouselRef.current.clientWidth
        ) {
          carouselRef.current.scrollLeft = 0;
        }
      }
    }, 50); // ゆっくり流れる

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full max-w-3xl mx-auto p-4 bg-black/50 bg-opacity-80 rounded shadow-lg">
      <h2 className="text-4xl font-bold mb-2">絵馬</h2>
      <p className="text-lg mb-4">絵馬投稿や他の人の投稿した絵馬をみるコンテンツ</p>

      <div className="overflow-hidden">
        <div
          ref={carouselRef}
          className="flex gap-4 whitespace-nowrap overflow-x-auto no-scrollbar"
        >
          {displayPosts.map((displayPost: DisplayPost, index) => {
            return (
              <div
                key={index}
                className="min-w-[240px] h-[240px] bg-cover bg-center bg-no-repeat rounded text-center px-4 py-2 transition-transform duration-300 relative"
                style={{
                  backgroundImage: `url(/images/ema/${emaList.find((e) => e.key === displayPost.emaImage)?.filename})`,
                  transform: `rotate(${displayPost.rotate}deg) translateY(${displayPost.translateY}px)`,
                  marginRight: displayPost.marginRight,
                }}
              >
                <div
                  className="absolute overflow-hidden flex items-center justify-center"
                  style={{
                    top: fontSizeMap[displayPost.fontSize].top,
                    left: fontSizeMap[displayPost.fontSize].left,
                    width: fontSizeMap[displayPost.fontSize].width,
                    height: fontSizeMap[displayPost.fontSize].height,
                  }}
                >
                  <p
                    className={`${fontList.find((f) => f.key === displayPost.font)?.className} ${fontSizeMap[displayPost.fontSize].className} text-center break-all whitespace-pre-wrap text-shadow`}
                    style={{
                      color: fontColorList.find((c) => c.key === displayPost.fontColor)?.value,
                    }}
                  >
                    {displayPost.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        {/* 絵馬選択 */}
        <div className="flex gap-2 items-center">
          {emaList.map(({ key, label }) => (
            <button
              key={key}
              className={`px-2 py-1 rounded ${
                emaImage === key ? 'bg-white text-black' : 'bg-gray-800 text-white'
              }`}
              onClick={() => setEmaImage(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 mb-4">
          {/* フォント選択 */}
          <select value={font} onChange={(e) => setFont(e.target.value as FontKey)}>
            {fontList.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          {/* フォントサイズ選択 */}
          <div className="flex gap-2 items-center">
            {fontSizeList.map(({ key, label }) => (
              <button
                key={key}
                className={`px-2 py-1 rounded border ${
                  fontSize === key ? 'bg-white text-black' : 'bg-gray-800 text-white'
                }`}
                onClick={() => setFontSize(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* カラー選択 */}
          <div className="flex gap-2 items-center">
            {fontColorList.map(({ key, label, value }) => (
              <button
                key={key}
                className={`w-6 h-6 rounded-full border-2 ${fontColor === key ? 'border-white' : 'border-transparent'}`}
                style={{ backgroundColor: value }}
                onClick={() => setFontColor(key)}
                title={label}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* 絵馬プレビュー */}
        <div
          className="relative w-[240px] h-[240px] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(/images/ema/${emaList.find((e) => e.key === emaImage)?.filename})`,
          }}
        >
          <div
            className="absolute overflow-hidden flex items-center justify-center"
            style={{
              top: fontSizeMap[fontSize].top,
              left: fontSizeMap[fontSize].left,
              width: fontSizeMap[fontSize].width,
              height: fontSizeMap[fontSize].height,
            }}
          >
            <p
              className={`${fontList.find((f) => f.key === font)?.className} ${fontSizeMap[fontSize].className} text-center break-all whitespace-pre-wrap text-shadow`}
              style={{ color: fontColorList.find((c) => c.key === fontColor)?.value }}
            >
              {wish || 'ここに表示されます'}
            </p>
          </div>
        </div>

        {/* テキストエリアは下に別で表示 */}
        <textarea
          maxLength={40} // ← これ！
          rows={4}
          value={wish}
          onChange={(e) => setWish(e.target.value)}
          className="w-[240px] max-w-md p-2 border rounded bg-black/90"
          placeholder="願い事を入力..."
        />
        <button
          onClick={handlePostWish}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          投稿する
        </button>
      </div>
    </section>
  );
};

export default EmaSection;
