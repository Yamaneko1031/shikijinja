import React from 'react';

// ボタンのバリアントとサイズ定義

type ButtonVariant = 'positive' | 'negative' | 'subNatural' | 'subNatural2' | 'custom';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** ボタンの見た目 */
  variant?: ButtonVariant;
  /** ボタンのサイズ */
  size?: ButtonSize;
  /** 追加のクラス */
  className?: string;
  /** 中身 */
  children?: React.ReactNode; // childrenをオプショナルに変更
}

const variantStyles: Record<ButtonVariant, string> = {
  positive: 'btn-positive inline-flex items-center justify-center',
  negative: 'btn-negative inline-flex items-center justify-center',
  subNatural: 'btn-sub-natural inline-flex items-center justify-center',
  subNatural2: 'btn-sub-natural-2 inline-flex items-center justify-center',
  custom: '',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-sm px-4 py-1',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-6 py-3',
};

/**
 * 汎用 Button コンポーネント
 * @param variant 背景色やホバー色を切り替え
 * @param size テキストサイズとパディングを切り替え
 * @param className 追加ユーティリティクラス
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'positive',
  size = 'md',
  className = '',
  children = null,
  ...props
}) => {
  const baseStyles = 'focus:outline-none';
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant as ButtonVariant]} ${sizeStyles[size as ButtonSize]} ${className} cursor-pointer`}
      style={{ minWidth: '2rem', minHeight: '2rem' }} // 最小サイズを指定
      {...props}
    >
      {children}
    </button>
  );
};
