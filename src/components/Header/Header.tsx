import React, { useState } from 'react';
import Image from 'next/image';
import { User } from '@/types/user';
import HeaderCoinCounter from './HeaderCoinCounter';
import HeaderMenu from './HeaderMenu';
import Modal from '../_shared/Modal';

interface HeaderProps {
  user: User;
  handleAddCoin: (coin: number) => void;
}

const Header: React.FC<HeaderProps> = (props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full h-[50px] bg-white z-60 overscroll-contain">
      <Modal isOpen={isMenuOpen}>
        <HeaderMenu user={props.user} handleCloseMenu={() => setIsMenuOpen(false)} />
      </Modal>
      {/* {isMenuOpen && <HeaderMenu user={props.user} handleCloseMenu={() => setIsMenuOpen(false)} />} */}
      <div className="flex items-center">
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
                  setIsMenuOpen(true);
                  console.log('ユーザーメニューを開く');
                }}
                //   aria-label="メニュー"
                //   onClick={() => {
                //     // TODO: メニューを開く処理を実装
                //     console.log('メニューを開く');
                //   }}
              >
                <Image src="/images/icon/icon_user.webp" alt="ユーザー" width={32} height={32} />
              </button>
            </div>
            {/* <div className="h-full flex items-center">
              <button
                className="p-2 hover:bg-gray-100 rounded-md"
                onClick={() => {
                  console.log('メニューを開く');
                }}
                //   aria-label="メニュー"
                //   onClick={() => {
                //     // TODO: メニューを開く処理を実装
                //     console.log('メニューを開く');
                //   }}
              >
                <Image src="/images/icon/icon_menu.webp" alt="メニュー" width={32} height={32} />
              </button>
            </div> */}
          </div>
        </div>
        {/* <div className="w-full h-full"></div> */}
      </div>
    </header>
  );
};

export default Header;
