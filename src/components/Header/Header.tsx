import React, { useState } from 'react';
import Image from 'next/image';
import { User, UserItems } from '@/types/user';
import HeaderCoinCounter from './HeaderCoinCounter';
import useSWR from 'swr';
import { apiFetch } from '@/lib/api';
import HelpMenu from './HelpMenu';
import UserMenu from './UserMenu';
import MenuWindow from '../_shared/MenuWindow';

interface HeaderProps {
  user: User;
  isInit: boolean;
  handleAddCoin: (coin: number) => void;
  setUser: (user: User) => void;
}

const Header: React.FC<HeaderProps> = (props) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);

  const fetcher = (url: string) => apiFetch<UserItems>(url).then((res) => res);
  const {
    data: userItems,
    isLoading: isLoadingUserItems,
    mutate: mutateUserItems,
  } = useSWR(props.isInit ? '/api/user/items' : null, fetcher, {
    revalidateOnFocus: false,
  });

  return (
    <header className="fixed top-0 left-0 w-full h-[3.125rem] min-w-[24rem] bg-white z-60 overscroll-contain">
      <MenuWindow
        isOpen={isUserMenuOpen}
        className="absolute bg-white rounded-md border-2 border-gray-200 top-12 right-2"
        handleOutsideClick={() => setIsUserMenuOpen(false)}
      >
        <UserMenu
          user={props.user}
          userItems={userItems}
          isLoadingUserItems={isLoadingUserItems}
          mutateUserItems={mutateUserItems}
          handleCloseMenu={() => setIsUserMenuOpen(false)}
          setUser={props.setUser}
        />
      </MenuWindow>
      <MenuWindow
        isOpen={isHelpMenuOpen}
        className="absolute bg-white rounded-md border-2 border-gray-200 top-12 right-8"
        handleOutsideClick={() => setIsHelpMenuOpen(false)}
      >
        <HelpMenu />
      </MenuWindow>
      {/* {isMenuOpen && <HeaderMenu user={props.user} handleCloseMenu={() => setIsMenuOpen(false)} />} */}
      <div className="flex items-center">
        <div className="left-0 min-w-[12.5rem] h-[3.125rem] flex items-center justify-center">
          <h1 className="text-2xl text-black font-bold">式岐神社</h1>
          <span className="ml-2 text-xs text-gray-600">SHIKI JINJA</span>
          <div className="absolute right-2 flex items-center">
            <div className="">
              <HeaderCoinCounter user={props.user} />
            </div>
            <div className="flex items-center">
              <button
                className="h-[2.5rem] w-[2.5rem] flex justify-center items-center hover:bg-gray-100 rounded-md"
                onClick={() => {
                  setIsHelpMenuOpen(true);
                }}
              >
                <Image
                  src="/images/icon/icon_help.webp"
                  alt="ヘルプ"
                  width={32}
                  height={32}
                  className="w-6 h-6"
                />
              </button>
            </div>
            <div className="flex items-center">
              <button
                className="h-[2.5rem] w-[2.5rem] flex justify-center items-center hover:bg-gray-100 rounded-md"
                onClick={() => {
                  setIsUserMenuOpen(true);
                }}
              >
                <Image
                  src="/images/icon/icon_user.webp"
                  alt="ユーザー"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                {props.user.isGuest && (
                  <span className="absolute top-1 text-[0.6rem] text-shadow text-amber-950 whitespace-nowrap bg-amber-100 rounded-full px-1">
                    ゲスト
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
