'use client';

import React, { useRef, useState } from 'react';
import { Button } from '../_shared/Button';
import NadenekoSeat from './NadenekoSeat';
import { NadenekoResponse } from '@/types/nadeneko';
import NadenekoResult from './NadenekoResult';
import { TokuId } from '@/types/toku';
import { User } from '@/types/user';
import Modal from '../_shared/Modal';
import { apiFetch } from '@/lib/api';

type Props = {
  lotData: NadenekoResponse | null;
  user: User;
  onClose: () => void;
  handleSetUser: (user: User) => void;
  handleAddCoin: (coin: number) => void;
  handleTokuGet: (tokuId: TokuId) => void;
  handleIsLimitOver: (tokuId: TokuId) => boolean;
  handleMutateRankingData: () => void;
};

export default function NadenekoModal({
  lotData,
  user,
  onClose,
  handleSetUser,
  handleAddCoin,
  handleTokuGet,
  handleIsLimitOver,
  handleMutateRankingData,
}: Props) {
  const [isFinished, setIsFinished] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isCloseButton, setIsCloseButton] = useState(false);
  const [renameName, setRenameName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFinished = () => {
    setIsFinished(true);
    setTimeout(() => {
      if (!handleIsLimitOver('nadeneko_first_result')) {
        if (user.name === '') {
          setIsRenameOpen(true);
        }
        handleTokuGet('nadeneko_first_result');
      }
      setIsCloseButton(true);
    }, 3000);
  };

  const handleClose = () => {
    if (lotData) {
      onClose();
      handleAddCoin(lotData.totalAddCoin);
    }
  };

  const handleRenameEnter = async () => {
    handleSetUser({ ...user, name: renameName });
    setIsRenameOpen(false);
    await apiFetch('/api/user/rename', {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: renameName }),
    });
    handleMutateRankingData();
  };

  return (
    <div className="select-none">
      {isFinished === false ? (
        <div className="min-h-[100lvh] flex flex-col items-center">
          <div className="m-auto">
            <NadenekoSeat
              lotData={lotData}
              handleFinished={handleFinished}
              handleTokuGet={handleTokuGet}
              handleIsLimitOver={handleIsLimitOver}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="min-h-[100lvh] flex flex-col items-center">
            <div className="m-auto">{lotData && <NadenekoResult lotData={lotData} />}</div>
          </div>
          <div className="fixed w-full bottom-6 m-auto flex flex-row justify-center gap-2">
            {/* 閉じるボタン */}
            <Button
              variant="negative"
              size="md"
              onClick={handleClose}
              aria-label="閉じる"
              disabled={!isCloseButton}
            >
              閉じる
            </Button>
          </div>
          <Modal
            isOpen={isRenameOpen}
            className="absolute w-[16rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md border-2 border-gray-200"
            handleOutsideClick={() => setIsRenameOpen(false)}
          >
            <div className="p-4 flex flex-col items-center gap-4">
              <div className="text-black/40 text-sm font-bold">ニックネームを教えてにゃ！</div>
              <input
                type="text"
                className="w-full border-2 border-gray-500 rounded-md text-black p-1"
                value={renameName}
                ref={inputRef}
                onChange={(e) => setRenameName(e.target.value.replace(/\r?\n/g, ''))}
              />
              <div className="flex flex-row items-center gap-2">
                <Button variant="negative" onClick={() => setIsRenameOpen(false)}>
                  あとで
                </Button>
                <Button variant="positive" onClick={() => handleRenameEnter()}>
                  決定
                </Button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}
