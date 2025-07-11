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
            <h3>入口</h3>
            <p>ご神託帳が置かれています。</p>
            <p>毎朝、神様たちが新しいメッセージを残してくださいます。</p>
          </li>
          <li>
            <h3>絵馬掛所</h3>
            <p>絵馬にあなたの願い事を書き込むことができます。</p>
            <p>神様から素敵なお言葉をいただけるかもしれません。</p>
            <p>
              他の参拝者の絵馬をタップすると、その願いに対する神様のメッセージを見ることもできます。
            </p>
          </li>
          <li>
            <h3>授与所</h3>
            <p>徳コインを使用してお守りを授かることができます。</p>
            <p>どのようなお守りをいただけるかは、みこ猫の気分次第です。</p>
            <p>きっとあなたにぴったりのお守りが授かれることでしょう。</p>
          </li>
          <li>
            <h3>おみくじ結び所</h3>
            <p>徳コインを使用しておみくじを引くことができます。</p>
            <p>
              「明日の運勢」「今月の運勢」「今年の運勢」の3種類から、お好きなものをお選びください。
            </p>
            <br />
            <p>【運勢の序列】</p>
            <dl>
              <dt>明日の運勢（ねこ日和）：</dt>
              <dd>毛玉 ＜ 尻尾 ＜ 子猫 ＜ 中猫 ＜ 大猫 ＜ ？？</dd>

              <dt>今月の運勢（ひとひら）：</dt>
              <dd>凶 ＜ 末吉 ＜ 小吉 ＜ 中吉 ＜ 吉 ＜ 大吉 ＜ ？？</dd>

              <dt>今年の運勢（おみくじ）：</dt>
              <dd>凶 ＜ 末吉 ＜ 小吉 ＜ 中吉 ＜ 吉 ＜ 大吉 ＜ ？？</dd>
            </dl>
          </li>
          <li>
            <h3>なで猫の社</h3>
            <p>ご利益があるといわれる猫の像が安置されています。</p>
            <p>1日1回なでることができ、なでると徳コインを獲得できます。</p>
            <p>獲得できる徳コインの量は、なで猫の気分によって変わります。</p>
            <p>毎日なでて、たくさんの徳コインを集めましょう。</p>
          </li>
          <li>
            <h3>拝殿</h3>
            <p>神様にお祈りをささげる神聖な場所です。</p>
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
