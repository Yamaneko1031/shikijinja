import { FontListItem, FontColorListItem } from '@/types/fonts';

export const fontList: FontListItem[] = [
  { key: 'ackaisyo', label: '英椎楷書', className: 'font-ackaisyo' },
  { key: 'aoyagi', label: '青柳衡山', className: 'font-aoyagi' },
  { key: 'otsutome', label: 'おつとめフォント', className: 'font-otsutome' },
  { key: 'yusei', label: 'Yusei Magic', className: 'font-yusei' },
] as const;

export const fontColorList: FontColorListItem[] = [
  { key: 'black', label: '黒', value: '#0c0c0c' },
  { key: 'red', label: '赤', value: '#B90000' },
  { key: 'blue', label: '青', value: '#183B80' },
  { key: 'green', label: '緑', value: '#0A672C' },
] as const;
