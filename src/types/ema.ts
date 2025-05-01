import { FontKey, FontColorKey } from '@/types/fonts';

export type EmaImageKey = 'shikineko' | 'iroha' | 'tenten' | 'nadeneko';

// テキストブロックの定義
export type TextBlock = {
  text: string;
  isVertical: boolean;
  font: FontKey;
  fontSize: number;
  fontColor: FontColorKey;
  textRotate: string;
  lineHeight: string;
  offsetX: number;
  offsetY: number;
  textWidth: number;
  textHeight: number;
};

// 投稿データの定義
export interface EmaPost {
  texts: TextBlock[];
  reply: string;
  emaImage: EmaImageKey;
}

// 投稿時のレスポンス
export interface EmaPostResponse {
  id: string;
  texts: TextBlock[];
  reply: string;
  emaImage: EmaImageKey;
  createdAt: string;
}

// カルーセルや表示用に拡張した型
export type DisplayPost = EmaPost & {
  drawKey: string;
  rotate: string;
  translateY: string;
  marginRight: string;
  highlighted?: boolean;
};

export type EmaListItem = {
  label: string;
  filename: string;
  illustname: string;
  grace: string;
  sampleText: string;
};

export type EmaList = {
  [key in EmaImageKey]: EmaListItem;
};

export type TextRectSize = {
  top: number;
  left: number;
  width: number;
  height: number;
};
