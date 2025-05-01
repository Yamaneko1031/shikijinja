import React from 'react';
import Image from 'next/image';
import { TextBlock } from '@/types/ema';
import { fontList, fontColorList } from '@/config/fonts';
import {
  fontSizePxRange,
  textRotateRange,
  lineHeightRange,
  textWidthRange,
  textHeightRange,
} from '@/config/ema';
import { Button } from '../../shared/Button';

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
    <div className="px-2 py-2 text-white rounded-sm shadow-lg w-[140px] space-y-4 select-none">
      {/* フォント選択 */}
      <div>
        <label className="block underline underline-offset-2 text-[10px] mb-1">フォント</label>
        <select
          value={textBlock.font}
          onChange={(e) => onChange({ font: e.target.value as TextBlock['font'] })}
          className="w-full bg-black border border-white rounded px-1 py-1 text-[12px]"
        >
          {fontList.map((f) => (
            <option key={f.key} value={f.key}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* 文字色 */}
      <div>
        <label className="block underline underline-offset-2 text-[10px] mb-1">文字色</label>
        <div className="flex gap-2">
          {fontColorList.map(({ key, value }) => (
            <button
              key={key}
              onClick={() => onChange({ fontColor: key })}
              className={`w-6 h-6 rounded-full border-2 shadow-white ${
                textBlock.fontColor === key ? 'border-white' : 'border-transparent'
              }`}
              style={{ backgroundColor: value, boxShadow: '0 0 1px white' }}
              title={key}
            />
          ))}
        </div>
      </div>

      {/* 縦書き切替 */}
      <div className="flex">
        <span className="underline underline-offset-2 text-[10px] text-left">縦書き</span>
        <input
          type="checkbox"
          checked={textBlock.isVertical}
          onChange={(e) => onChange({ isVertical: e.target.checked })}
          className="w-5 h-5 text-black rounded ml-3"
        />
      </div>

      {/* サイズ調整 */}
      <div className="flex justify-between">
        <span className="underline underline-offset-2 text-[10px]">サイズ</span>
        <div className="flex items-center gap-2">
          <Button
            variant="subNatural"
            size="sm"
            onClick={() => adjustField('fontSize', -1)}
            className="px-2 py-1 bg-black rounded"
          >
            <Image
              src="/images/icon/icon_down.svg"
              alt="Decrease"
              width={16}
              height={16}
              className="absolute"
            />
          </Button>
          <Button
            variant="subNatural"
            size="sm"
            onClick={() => adjustField('fontSize', 1)}
            className="px-2 py-1 bg-black rounded"
          >
            <Image
              src="/images/icon/icon_up.svg"
              alt="Increase"
              width={16}
              height={16}
              className="absolute"
            />
          </Button>
        </div>
      </div>

      {/* 角度調整 */}
      <div className="flex justify-between">
        <span className="underline underline-offset-2 text-[10px]">角度</span>
        <div className="flex items-center gap-2">
          <Button
            variant="subNatural"
            size="sm"
            onClick={() => adjustField('textRotate', 1)}
            className="px-2 py-1 bg-black rounded"
          >
            <Image
              src="/images/icon/icon_rotate_l.svg"
              alt="Decrease"
              width={16}
              height={16}
              className="absolute"
            />
          </Button>
          <Button
            variant="subNatural"
            size="sm"
            onClick={() => adjustField('textRotate', -1)}
            className="px-2 py-1 bg-black rounded"
          >
            <Image
              src="/images/icon/icon_rotate_r.svg"
              alt="Increase"
              width={16}
              height={16}
              className="absolute"
            />
          </Button>
        </div>
      </div>

      {/* 行間調整 */}
      <div className="flex justify-between">
        <span className="underline underline-offset-2 text-[10px]">行間</span>
        <div className="flex items-center gap-2">
          <Button
            variant="subNatural"
            size="sm"
            onClick={() => adjustField('lineHeight', -0.1)}
            className="px-2 py-1 bg-black rounded"
          >
            <Image
              src="/images/icon/icon_down.svg"
              alt="Decrease"
              width={16}
              height={16}
              className="absolute"
            />
          </Button>
          <Button
            variant="subNatural"
            size="sm"
            onClick={() => adjustField('lineHeight', 0.1)}
            className="px-2 py-1 bg-black rounded"
          >
            <Image
              src="/images/icon/icon_up.svg"
              alt="Increase"
              width={16}
              height={16}
              className="absolute"
            />
          </Button>
        </div>
      </div>

      {/* 最大幅／最大高さ (縦横切替) */}
      <div className="flex justify-between">
        <span className="underline underline-offset-2 text-[10px]">
          {textBlock.isVertical ? '最大高さ' : '最大幅'}
        </span>
        <input
          type="range"
          min={textBlock.isVertical ? textHeightRange.min : textWidthRange.min}
          max={textBlock.isVertical ? textHeightRange.max : textWidthRange.max}
          step={5}
          value={textBlock.isVertical ? textBlock.textHeight : textBlock.textWidth}
          onChange={(e) =>
            onChange(
              textBlock.isVertical
                ? { textHeight: Number(e.target.value) }
                : { textWidth: Number(e.target.value) }
            )
          }
          className="w-[80px]"
        />
      </div>
    </div>
  );
}
