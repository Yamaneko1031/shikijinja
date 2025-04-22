export type FontKey = 'ackaisyo' | 'aoyagi' | 'otsutome' | 'yusei';
export type FontColorKey = 'black' | 'red' | 'blue' | 'green';

// 配列アイテムの型
export interface FontListItem {
  key: FontKey;
  label: string;
  className: string;
}
export interface FontColorListItem {
  key: FontColorKey;
  label: string;
  value: string;
}
