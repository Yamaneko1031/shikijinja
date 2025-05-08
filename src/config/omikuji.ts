import { OmikujiList } from '@/types/omikuji';

// 絵馬背景テーブル
export const omikujiList: OmikujiList = {
  shikineko: {
    label: 'しきねこ',
    illustname: 'illust_shikineko.webp',
    grace: '主にエンジニア業務における\nご利益があるとされている',
  },
  iroha: {
    label: 'いろは',
    illustname: 'illust_iroha.webp',
    grace: '主にデザイン業務における\nご利益があるとされている',
  },
  tenten: {
    label: 'てんてん',
    illustname: 'illust_tenten.webp',
    grace: '主にPM業務における\nご利益があるとされている',
  },
  //   nadeneko: {
  //     label: 'なでねこ',
  //     illustname: 'illust_nadeneko.webp',
  //     grace: '撫でられると喜ぶ\n心身快癒を招くとされている',
  //   },
} as const;
