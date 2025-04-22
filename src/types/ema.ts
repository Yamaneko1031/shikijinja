import { FontKey, FontColorKey } from '@/types/fonts';

export type EmaImageKey = 'shikineko' | 'iroha' | 'tenten' | 'nadeneko';

// テキストブロックの定義
export type TextBlock = {
  text: string;
  font: FontKey;
  fontSize: number;
  fontColor: FontColorKey;
  textRotate: string;
  lineHeight: string;
  offsetX: number;
  offsetY: number;
  textWidth: number;
};

// 投稿データの定義
export interface Post {
  texts: TextBlock[];
  reply: string;
  emaImage: EmaImageKey;
}

// カルーセルや表示用に拡張した型
export type DisplayPost = Post & {
  drawKey: string; // 一意キー（UUIDなど）
  rotate: string; // 表示時の回転角度（deg）
  translateY: string; // 表示時のY方向オフセット（px）
  marginRight: string; // カルーセル配置時の余白
  highlighted?: boolean; // 挿入時のハイライトフラグ
};

export type EmaListItem = {
  label: string;
  filename: string;
  illustname: string;
  grace: string;
};

export type EmaList = {
  [key in EmaImageKey]: EmaListItem;
};
