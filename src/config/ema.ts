import { EmaList, TextBlock } from '@/types/ema';

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
  top: 7.5,
  left: 1.875,
  width: 11.25,
  height: 6.5625,
} as const;

export const initialTexts: TextBlock[] = [
  {
    text: '',
    isVertical: false,
    font: 'ackaisyo',
    fontSize: 1.5,
    fontColor: 'black',
    textRotate: '0',
    lineHeight: '1.2',
    offsetX: 0,
    offsetY: -0.125,
    textWidth: defaultTextRectSize.width,
    textHeight: defaultTextRectSize.height,
  },
  {
    text: '',
    isVertical: false,
    font: 'ackaisyo',
    fontSize: 1,
    fontColor: 'black',
    textRotate: '0',
    lineHeight: '1.2',
    offsetX: 1.875,
    offsetY: 2.375,
    textWidth: defaultTextRectSize.width,
    textHeight: defaultTextRectSize.height,
  },
];

export const fontSizePxRange = {
  min: 0.5,
  max: 2,
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
  min: 3,
  max: defaultTextRectSize.width,
} as const;

export const textHeightRange = {
  min: 3,
  max: defaultTextRectSize.height,
} as const;
