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
    <header className="fixed top-0 left-0 w-full h-[3.125rem] bg-white z-60 overscroll-contain">
      <Modal isOpen={isMenuOpen}>
        <HeaderMenu user={props.user} handleCloseMenu={() => setIsMenuOpen(false)} />
      </Modal>
      {/* {isMenuOpen && <HeaderMenu user={props.user} handleCloseMenu={() => setIsMenuOpen(false)} />} */}
      <div className="flex items-center">
        <div className="left-0 min-w-[12.5rem] h-[3.125rem] flex items-center justify-center">
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
                }}
              >
                <Image
                  src="/images/icon/icon_user.webp"
                  alt="ユーザー"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
