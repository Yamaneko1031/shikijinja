import React from 'react';
import Image from 'next/image';
import { User } from '@/types/user';
import HeaderCoinCounter from './HeaderCoinCounter';

interface HeaderProps {
  user: User;
  handleAddCoin: (coin: number) => void;
}

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <header className="fixed top-0 left-0 w-full h-[50px] bg-white z-1">
      <div className="flex items-center justify-center">
        <div className="left-0 min-w-[200px] h-[50px] flex items-center justify-center">
          {/* <Image src="/images/icon/icon_logo.webp" alt="式岐神社" width={40} height={40} /> */}
          <h1 className="text-2xl text-black font-bold">式岐神社</h1>
          <span className="ml-2 text-xs text-gray-600">SHIKI JINJA</span>
          <div className="absolute right-2 flex items-center">
            <div className="">
              <HeaderCoinCounter user={props.user} />
            </div>
            <div className="h-full flex items-center">
              <button
                className="p-2 hover:bg-gray-100 rounded-md"
                onClick={() => {
                  console.log('メニューを開く');
                  if (props.user.coin > 500) {
                    props.handleAddCoin(-500);
                  } else {
                    props.handleAddCoin(100);
                  }
                }}
                //   aria-label="メニュー"
                //   onClick={() => {
                //     // TODO: メニューを開く処理を実装
                //     console.log('メニューを開く');
                //   }}
              >
                <Image src="/images/icon/icon_menu.webp" alt="メニュー" width={32} height={32} />
              </button>
            </div>
          </div>
        </div>
        <div className="w-full h-full"></div>
      </div>
    </header>
  );
};

export default Header;
