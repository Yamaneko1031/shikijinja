'use client';

import { useState } from "react";
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from "next/image";

export default function Home() {
  const { scrollY } = useScroll();
  const toriiScale = useTransform(scrollY, [0, 500], [1, 4.0]); // スクロール0〜300pxで1倍→1.8倍
  const toriiOpacity = useTransform(scrollY, [100, 500], [1, 0]);
  const titleOpacity = useTransform(scrollY, [50, 300], [1, 0]);

  const [message, setMessage] = useState("まだお告げはありません");
  const [loading, setLoading] = useState(false);

  const fetchOmikuji = async () => {
    setLoading(true);
    setMessage("神様と交信中…⛩️");

    try {
      const res = await fetch("/api/omikuji", { method: "POST" });
      const data = await res.json();
      setMessage(data.result);
    } catch (err) {
      setMessage("お告げの取得に失敗しました…🐾");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative w-full w-full min-h-[200vh] overflow-x-hidden">
      {/* 背景画像 */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/bg.webp"
          alt="背景"
          fill
          className="object-cover"
          priority
        />
      </div>

      <section className="relative w-full h-[100vh] z-30">
        {/* 鳥居だけ拡大 */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            scale: toriiScale,
            opacity: toriiOpacity,
            width: '70vw',
            height: 'calc(70vw * 1)',
          }}
        >
          <Image
            src="/images/torii.webp"
            alt="式岐神社の鳥居"
            fill
            className="object-contain"
          />
        </motion.div>

        {/* テキスト：拡大しない・位置は鳥居に合わせて */}
        <motion.h1
          style={{ opacity: titleOpacity }}
          className="absolute top-[30%] left-1/2 -translate-x-1/2 text-white text-4xl sm:text-6xl font-bold drop-shadow-[0_0_5px_rgba(0,0,0,1)] z-40 pointer-events-none"
        >
          式岐神社
        </motion.h1>
      </section>
      
      {/* スクロール後に出てくるコンテンツ */}
      <section className="relative z-30 w-full text-white text-center py-40">
        <h2 className="text-2xl sm:text-4xl font-semibold">
          <button
            onClick={fetchOmikuji}
            className={`px-4 py-2 rounded ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            disabled={loading}
          >
            {loading ? "おみくじ引き中…" : "おみくじを引く"}
          </button>
          <p className="mt-6 text-center">{message}</p>
        </h2>
      </section>

      {/* スクロール後に出てくるコンテンツ */}
      <section className="relative z-30 w-full text-white text-center py-40">
        <h2 className="text-2xl sm:text-4xl font-semibold">ようこそ式岐神社へ</h2>
      </section>
      

      {/* <section id="kokoroe">
        <div>心得</div>
      </section>

      <section id="ema">
        <div>絵馬</div>
      </section>

      <section id="omamori">
        <div>御守り</div>
      </section>

      <section id="nade-neko">
        <div>撫で猫</div>
      </section>

      <section id="omikuji">
        <div>おみくじ</div>
      </section>

      <section id="kamigami">
        <div>神様紹介</div>
      </section>

      <section id="haiden">
        <div>拝殿</div>
      </section> */}
    </main>
  );
}
