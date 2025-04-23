import React from 'react';
import { TextBlock } from '@/types/ema';
import { fontList, fontColorList } from '@/config/fonts';
import { fontSizePxRange, defaultTextRectSize } from '@/config/ema';

export interface TextSettingsPanelProps {
  textBlock: TextBlock;
  isOpen: boolean;
  onChange: (patch: Partial<TextBlock>) => void;
}

export default function TextSettingsPanel({ textBlock, isOpen, onChange }: TextSettingsPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="px-2 py-2 bg-black/90 text-white rounded-lg shadow-lg w-[140px] space-y-2">
      {/* フォント選択 */}
      <div>
        <label className="block text-sm mb-1">フォント</label>
        <select
          value={textBlock.font}
          onChange={(e) => onChange({ font: e.target.value as TextBlock['font'] })}
          className="w-full bg-black border border-white rounded px-1 py-1 text-sm"
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
        <label className="block text-sm mb-1">文字色</label>
        <div className="flex gap-2">
          {fontColorList.map(({ key, value }) => (
            <button
              key={key}
              onClick={() => onChange({ fontColor: key })}
              className={`w-6 h-6 rounded-full border-2 ${
                textBlock.fontColor === key ? 'border-white' : 'border-transparent'
              }`}
              style={{ backgroundColor: value }}
              title={key}
            />
          ))}
        </div>
      </div>

      {/* サイズ */}
      <div>
        <label className="block text-sm mb-1">サイズ</label>
        <input
          type="range"
          min={fontSizePxRange.min}
          max={fontSizePxRange.max}
          step={1}
          value={textBlock.fontSize}
          onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* 角度 */}
      <div>
        <label className="block text-sm mb-1">角度</label>
        <input
          type="range"
          min={-10}
          max={10}
          step={1}
          value={Number(textBlock.textRotate)}
          onChange={(e) => onChange({ textRotate: e.target.value })}
          className="w-full"
        />
      </div>

      {/* 行間 */}
      <div>
        <label className="block text-sm mb-1">行間</label>
        <input
          type="range"
          min={1.0}
          max={2.0}
          step={0.1}
          value={Number(textBlock.lineHeight)}
          onChange={(e) => onChange({ lineHeight: e.target.value })}
          className="w-full"
        />
      </div>

      {/* 最大幅 */}
      <div>
        <label className="block text-sm mb-1">最大幅</label>
        <input
          type="range"
          min={80}
          max={defaultTextRectSize.width}
          step={5}
          value={textBlock.textWidth}
          onChange={(e) => onChange({ textWidth: Number(e.target.value) })}
          className="w-full"
        />
      </div>
    </div>
  );
}
