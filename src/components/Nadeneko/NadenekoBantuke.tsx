'use client';

import React from 'react';
import { Button } from '../_shared/Button';
import { NadenekoBantukeResponse } from '@/types/nadeneko';
type Props = {
  rankingData: NadenekoBantukeResponse | undefined;
  isLoading: boolean;
  onClose: () => void;
};

export default function NadenekoBantuke({ rankingData, isLoading, onClose }: Props) {
  const today = new Date();
  const month = today.getMonth() + 1;

  return (
    <div className="select-none flex flex-col items-center justify-center">
      <div className="min-h-[100lvh] pt-5 flex flex-col items-center justify-center">
        <div className="w-[50rem] h-[40rem] flex flex-col bg-[url('/images/bg_hude/bg_bantuke.webp')] bg-[length:100%_100%]">
          <div className="relative top-45 left-1/2 -translate-x-1/2 w-[17rem] text-center font-otsutome">
            <div className="text-black text-3xl font-bold">{month}月 なでねこ番付</div>
            {isLoading ? (
              <div className="text-black text-sm">読み込み中...</div>
            ) : (
              <>
                <table className="mt-5">
                  <thead>
                    <tr className="text-gray-800 text-xs h-[1.8rem] text-right">
                      <th className="w-[2.8rem]"></th>
                      <th className="w-[4rem]">総獲得</th>
                      <th className="w-[3.2rem]">総なで</th>
                      <th className="w-[7rem]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(10)].map((_, index) => {
                      const data = rankingData?.rankingData[index];
                      return (
                        <tr
                          key={index}
                          className="text-black font-bold h-[1.8rem] text-lg text-right"
                        >
                          <td>{index + 1}位</td>
                          <td>{data ? data.points : '-'}</td>
                          <td>{data ? data.pettingCount : '-'}</td>
                          <td className="overflow-hidden whitespace-nowrap max-w-[8rem] text-ellipsis">
                            {data ? (data.userName ? data.userName : '名無し') : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
          </div>
          <div className="fixed w-full bottom-6 m-auto flex flex-row justify-center gap-2">
            {/* 閉じるボタン */}
            <Button variant="negative" size="md" onClick={onClose} aria-label="閉じる">
              閉じる
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
