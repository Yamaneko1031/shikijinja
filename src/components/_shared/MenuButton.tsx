import React from 'react';

export interface MenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode; // childrenをオプショナルに変更
}

export const MenuButton: React.FC<MenuButtonProps> = ({ children = null, ...props }) => {
  return (
    <button className="w-full text-left hover:bg-gray-100 disabled:opacity-50" {...props}>
      <div className="m-1">{children}</div>
    </button>
  );
};
