import { EmaList } from '@/types/ema';

// 絵馬背景テーブル
export const emaList: EmaList = {
  shikineko: {
    label: 'しきねこ',
    filename: 'ema_shikineko.webp',
    illustname: 'illust_shikineko.webp',
    grace: '主にエンジニア業務における\nご利益があるとされている',
    sampleText: 'バグが出ませんように',
  },
  iroha: {
    label: 'いろは',
    filename: 'ema_iroha.webp',
    illustname: 'illust_iroha.webp',
    grace: '主にデザイン業務における\nご利益があるとされている',
    sampleText: '猫と仲良くなれますように',
  },
  tenten: {
    label: 'てんてん',
    filename: 'ema_tenten.webp',
    illustname: 'illust_tenten.webp',
    grace: '主にPM業務における\nご利益があるとされている',
    sampleText: '炎上しませんように',
  },
  nadeneko: {
    label: 'なでねこ',
    filename: 'ema_nadeneko.webp',
    illustname: 'illust_nadeneko.webp',
    grace: '撫でられると喜ぶ\n心身快癒を招くとされている',
    sampleText: 'ごろにゃん',
  },
} as const;

export const defaultTextRectSize = {
  top: 120,
  left: 30,
  width: 180,
  height: 105,
} as const;

export const defaultOffsetPos = [
  { offsetX: 0, offsetY: -5 },
  { offsetX: 0, offsetY: 38 },
] as const;

export const fontSizePxRange = {
  min: 14,
  max: 32,
} as const;

export const textRotateRange = {
  min: -20,
  max: 20,
} as const;

export const lineHeightRange = {
  min: 1.0,
  max: 1.8,
} as const;

export const textWidthRange = {
  min: 50,
  max: defaultTextRectSize.width,
} as const;

export const textHeightRange = {
  min: 50,
  max: defaultTextRectSize.height,
} as const;
