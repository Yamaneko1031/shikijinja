import React, { useState, useRef } from 'react';
import { TextBlock, EmaPost, EmaImageKey } from '@/types/ema';
import { emaList } from '@/config/ema';
import { Button } from '../../_shared/Button';
import EmaFormHeader from './EmaFormHeader';
import EmaFormEditor from './EmaFormEditor';

export interface EmaFormProps {
  initialDeityKey: EmaImageKey;
  onSubmit: (post: EmaPost) => void;
  onClose: () => void;
}

export default function EmaForm({ initialDeityKey, onSubmit, onClose }: EmaFormProps) {
  const [deityKey, setDeityKey] = useState<EmaImageKey>(initialDeityKey);
  const [isOverFlowError, setIsOverFlowError] = useState(false);
  const [isMainTextEmptyError, setIsMainTextEmptyError] = useState(false);
  const textsRef = useRef<TextBlock[]>([]);

  // Submit
  const handleSubmit = (texts: TextBlock[]) => {
    // 投稿ボタンをdisableにしているが念のため
    if (isOverFlowError) {
      alert('文字が入力されていません。');
      return;
    }
    // 投稿ボタンをdisableにしているが念のため
    if (isMainTextEmptyError) {
      alert('文字が絵馬からはみ出しています。位置や角度、行間を調整してください。');
      return;
    }
    onSubmit({ texts, reply: '返信待ち', emaImage: deityKey, decision: 'UNCHECKED', reasons: [] });
    onClose();
  };

  // Deity navigation
  const keys = Object.keys(emaList) as EmaImageKey[];
  const idx = keys.indexOf(deityKey);
  const prevKey = keys[(idx - 1 + keys.length) % keys.length];
  const nextKey = keys[(idx + 1) % keys.length];

  return (
    <div>
      <div className="relative flex flex-col items-center">
        {/* 神様選択、説明 */}
        <EmaFormHeader
          deityKey={deityKey}
          setDeityKey={setDeityKey}
          prevKey={prevKey}
          nextKey={nextKey}
        />

        {/* テキスト編集関係 */}
        <EmaFormEditor
          deityKey={deityKey}
          textsRef={textsRef}
          setIsOverFlowError={setIsOverFlowError}
          setIsMainTextEmptyError={setIsMainTextEmptyError}
        />

        {/* ダイアログ下部のボタン */}
        <div className="flex w-full flex-col items-center">
          <div className="min-h-6 text-sm text-red-500 flex items-center">
            {isMainTextEmptyError
              ? '本文が入力されていません。'
              : isOverFlowError
                ? '文字が絵馬からはみ出しています。'
                : ''}
          </div>
          <div className="flex gap-2">
            <Button onClick={onClose} variant="negative" size="md">
              やめる
            </Button>
            <Button
              onClick={() => handleSubmit(textsRef.current)}
              variant="positive"
              size="md"
              disabled={isOverFlowError || isMainTextEmptyError}
            >
              投稿する
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
