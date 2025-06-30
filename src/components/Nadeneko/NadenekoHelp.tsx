'use client';

import React from 'react';

type Props = {
  handleClose: () => void;
};

export default function NadenekoHelp({ handleClose }: Props) {
  return (
    <div className="w-full h-full flex flex-col items-center text-black p-2" onClick={handleClose}>
      <ul className="help-ul">
        <li>
          <h3>徳を貯めよう</h3>
          <p>
            猫の像を指でなでなで（ドラッグ）すると「徳」が貯まります。たくさんなでて徳を積もう。
          </p>
        </li>
        <li>
          <h3>猫が満足したら終わり</h3>
          <p>
            なでなでが続くと、突然「満足にゃ！」といって終わり。…え、もう終わり！？なんて言わないで。ご機嫌は猫次第。
          </p>
        </li>
        <li>
          <h3>徳を自慢しよう</h3>
          <p>たくさん徳が貯まったら、その幸運を友達におすそ分け（自慢）しましょう！</p>
        </li>
        <li>
          <h3>全自動なでなで機能</h3>
          <p>【おまかせ】ボタンを押せば、あとは自動でOK。あなたの指はもう休んで大丈夫です。</p>
        </li>
      </ul>
      {/* <div className="max-h-[60vh] w-full overflow-scroll m-1 p-2 border-2 border-gray-100">
      </div> */}
    </div>
  );
}
