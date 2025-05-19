import React from 'react';
import Image from 'next/image';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full h-[50px] bg-white z-1">
      <div className="flex items-center justify-center">
        <div className="left-0 min-w-[200px] h-[50px] flex items-center justify-center">
          {/* <Image src="/images/icon/icon_logo.webp" alt="式岐神社" width={40} height={40} /> */}
          <h1 className="text-2xl text-black font-bold">式岐神社</h1>
          <span className="ml-2 text-xs text-gray-600">SHIKI JINJA</span>
          <div className="absolute right-2 h-full flex items-center">
            <button
              className="p-2 hover:bg-gray-100 rounded-md"
              //   aria-label="メニュー"
              //   onClick={() => {
              //     // TODO: メニューを開く処理を実装
              //     console.log('メニューを開く');
              //   }}
            >
              <Image src="/images/icon/icon_menu.webp" alt="メニュー" width={40} height={40} />
            </button>
          </div>
        </div>
        <div className="w-full h-full"></div>
      </div>
    </header>
  );
};

export default Header;
