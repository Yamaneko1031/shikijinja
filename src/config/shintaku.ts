import { ShintakuTypeTable } from '@/types/shintaku';

// 絵馬背景テーブル
export const shintakuTypeTable: ShintakuTypeTable = {
  shikineko: {
    label: 'しきねこ',
    illustname: 'illust_shikineko.webp',
  },
  iroha: {
    label: 'いろは',
    illustname: 'illust_iroha.webp',
  },
  tenten: {
    label: 'てんてん',
    illustname: 'illust_tenten.webp',
  },
} as const;
