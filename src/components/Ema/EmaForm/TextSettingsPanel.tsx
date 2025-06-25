import React from 'react';
import { TextBlock } from '@/types/ema';
import { fontColorList } from '@/config/fonts';
import {
  fontSizePxRange,
  textRotateRange,
  lineHeightRange,
  textWidthRange,
  textHeightRange,
} from '@/config/ema';
import TextAdjustmentButton from './TextAdjustmentButton';

export interface TextSettingsPanelProps {
  textBlock: TextBlock;
  onChange: (patch: Partial<TextBlock>) => void;
}

export default function TextSettingsPanel({ textBlock, onChange }: TextSettingsPanelProps) {
  const adjustField = (field: keyof TextBlock, delta: number) => {
    const current = parseFloat(String(textBlock[field])) || 0;
    let next = current + delta;
    switch (field) {
      case 'fontSize':
        next = Math.min(Math.max(next, fontSizePxRange.min), fontSizePxRange.max);
        break;
      case 'textRotate':
        next = Math.min(Math.max(next, textRotateRange.min), textRotateRange.max);
        break;
      case 'lineHeight':
        next = Math.min(Math.max(next, lineHeightRange.min), lineHeightRange.max);
        next = Number(next.toFixed(1));
        break;
      case 'textWidth':
        next = Math.min(Math.max(next, textWidthRange.min), textWidthRange.max);
        break;
      case 'textHeight':
        next = Math.min(Math.max(next, textHeightRange.min), textHeightRange.max);
        break;
      default:
        break;
    }
    onChange({ [field]: next } as Partial<TextBlock>);
  };

  return (
    <div className="text-white min-w-[5rem] space-y-2 select-none">
      {/* 文字色 */}
      <div>
        <label className="block underline underline-offset-2 text-[0.75rem] mb-1">文字色</label>
        <div className="grid grid-cols-2 gap-2 w-fit">
          {fontColorList.map(({ key, value }) => (
            <button
              key={key}
              onClick={() => onChange({ fontColor: key })}
              className={`w-[1.875rem] h-[1.875rem] rounded-full border-2 shadow-white cursor-pointer ${
                textBlock.fontColor === key ? 'border-white' : 'border-transparent'
              }`}
              style={{ backgroundColor: value, boxShadow: '0 0 1px white' }}
              title={key}
            />
          ))}
        </div>
      </div>

      {/* サイズ調整 */}
      <TextAdjustmentButton
        label="文字サイズ"
        onDecrease={() => adjustField('fontSize', -0.125)}
        onIncrease={() => adjustField('fontSize', 0.125)}
        decreaseIconPath="/images/icon/icon_down.svg"
        increaseIconPath="/images/icon/icon_up.svg"
      />

      {/* 角度調整 */}
      <TextAdjustmentButton
        label="角度"
        onDecrease={() => adjustField('textRotate', 1)}
        onIncrease={() => adjustField('textRotate', -1)}
        decreaseIconPath="/images/icon/icon_rotate_l.svg"
        increaseIconPath="/images/icon/icon_rotate_r.svg"
      />

      {/* 行間調整 */}
      <TextAdjustmentButton
        label="行間"
        onDecrease={() => adjustField('lineHeight', -0.1)}
        onIncrease={() => adjustField('lineHeight', 0.1)}
        decreaseIconPath="/images/icon/icon_down.svg"
        increaseIconPath="/images/icon/icon_up.svg"
      />

      {/* 最大幅／最大高さ (縦横切替) */}
      {textBlock.isVertical ? (
        <TextAdjustmentButton
          label="最大高さ"
          onDecrease={() => adjustField('textHeight', -0.125)}
          onIncrease={() => adjustField('textHeight', 0.125)}
          decreaseIconPath="/images/icon/icon_down.svg"
          increaseIconPath="/images/icon/icon_up.svg"
        />
      ) : (
        <TextAdjustmentButton
          label="最大幅"
          onDecrease={() => adjustField('textWidth', -0.125)}
          onIncrease={() => adjustField('textWidth', 0.125)}
          decreaseIconPath="/images/icon/icon_down.svg"
          increaseIconPath="/images/icon/icon_up.svg"
        />
      )}
    </div>
  );
}
