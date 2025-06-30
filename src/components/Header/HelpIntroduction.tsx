'use client';

import React from 'react';
import { Button } from '../_shared/Button';

type Props = {
  onClose: () => void;
};

export default function HelpIntroduction({ onClose }: Props) {
  return (
    <div className="w-full h-full flex flex-col items-center text-black">
      <div className="min-h-[3rem] flex justify-center items-center">式岐神社について</div>
      <div className="max-h-[60vh] w-full overflow-scroll m-1 p-2 border-2 border-gray-100">
        <div className="flex flex-col gap-4">
          <p className="w-full text-center text-lg font-bold">式岐神社とは</p>
          <p>
            式岐神社（しきじんじゃ）は、デジタルの世界で日々奮闘するすべての方々のためのオンライン神社です。
          </p>
          <p>
            ここにはIT業界に親和性の高い三柱（エンジニア、デザイン、PM）の神様が祭られています。
          </p>
          <p>
            「プロジェクトの成功」「アイデアの閃き」「バグの解消」といったIT業界で働く人たちには欠かせない様々なご利益を授かれると言われています。
          </p>
          <p>
            深夜の作業中でも、朝のミーティング前でも、ランチ後の一息でも。24時間365日、いつでもお参りいただけます。
          </p>
        </div>
        <div className="w-full border-t border-gray-200 my-4"></div>
        <p className="w-full text-center text-lg font-bold">境内紹介</p>
        <ul className="help-ul">
          <li>
            <p>入口</p>
            <p>ご神託帳が置かれており、毎朝神様達がメッセージを残しています。</p>
          </li>
          <li>
            <p>絵馬掛所</p>
            <p>絵馬にあなたの願い事を書き込んでみましょう。神様から素敵なお言葉が貰えるかも？</p>
            <p>
              他の人の絵馬をタップすると、その願いに対する神様のメッセージを見ることも出来ます。
            </p>
          </li>
          <li>
            <p>授与所</p>
            <p>徳コインを消費してお守りを購入することが出来ます。</p>
            <p>どんなお守りが貰えるかは、みこ猫の気分次第！？</p>
            <p>きっと貴方にとって最適なお守りが貰えるはずです。</p>
          </li>
          <li>
            <p>おみくじ結び所</p>
            <p>徳コインを消費しておみくじを引くことが出来ます。</p>
            <p>
              明日の運勢、今月の運勢、今年の運勢と３種類あるので、貴方が知りたいものを選びましょう。
            </p>
            <br />
            <p>【運勢の序列】</p>
            <p>明日の運勢（ねこ日和）: 毛玉 &lt; 尻尾 &lt; 子猫 &lt; 中猫 &lt; 大猫 &lt; 虎</p>
            <p>
              今月の運勢（ひとひら）: 凶 &lt; 末吉 &lt; 小吉 &lt; 中吉 &lt; 吉 &lt; 大吉 &lt; 猫
            </p>
            <p>
              今年の運勢（おみくじ）: 凶 &lt; 末吉 &lt; 小吉 &lt; 中吉 &lt; 吉 &lt; 大吉 &lt; 猫
            </p>
          </li>
          <li>
            <p>なで猫の社</p>
            <p>なでるとご利益があると言われている猫の像が置かれています。</p>
            <p>１日１回なでることが出来て、なでると徳コインを獲得することが出来ます。</p>
            <p>獲得できる徳コインの量は、なで猫の気分次第。</p>
            <p>たくさんなでて大量の徳コイン獲得を目指しましょう。</p>
          </li>
          <li>
            <p>拝殿</p>
            <p>神様にお祈りをする場所。</p>
            <p>賽銭を投げてお祈りをするとご利益があるかもしれません。</p>
          </li>
        </ul>
      </div>
      <div className="min-h-[3rem] flex justify-center items-center">
        <Button variant="negative" size="md" onClick={onClose} aria-label="閉じる">
          閉じる
        </Button>
      </div>
    </div>
  );
}
