import { EmaList } from '@/types/ema';

// 絵馬背景テーブル
export const emaList: EmaList = {
  shikineko: {
    label: 'しきねこ',
    filename: 'ema_shikineko.webp',
    illustname: 'illust_shikineko.webp',
    grace: '主にエンジニア業務における\nご利益があるとされている',
  },
  iroha: {
    label: 'いろは',
    filename: 'ema_iroha.webp',
    illustname: 'illust_iroha.webp',
    grace: '主にデザイン業務における\nご利益があるとされている',
  },
  tenten: {
    label: 'てんてん',
    filename: 'ema_tenten.webp',
    illustname: 'illust_tenten.webp',
    grace: '主にPM業務における\nご利益があるとされている',
  },
  nadeneko: {
    label: 'なでねこ',
    filename: 'ema_nadeneko.webp',
    illustname: 'illust_nadeneko.webp',
    grace: '撫でられると喜ぶ\n心身快癒を招くとされている',
  },
} as const;

export const fontSizePxRange = {
  min: 14,
  max: 32,
} as const;

export const defaultTextRectSize = {
  top: 110,
  left: 35,
  width: 170,
  height: 100,
} as const;

export const defaultOffsetPos = [
  { offsetX: 0, offsetY: 0 },
  { offsetX: 0, offsetY: 35 },
] as const;
