'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { User, UserItems } from '@/types/user';
import { signIn, signOut, useSession } from 'next-auth/react';
import { apiFetch } from '@/lib/api';
import { Button } from '../_shared/Button';
import Modal from '../_shared/Modal';
import MyOmikujiView from './MyOmikujiView';
import MyOmamoriView from './MyOmamoriView';
import MyEmaView from './MyEmaView';
import { MenuButton } from '../_shared/MenuButton';
import { getTokuCoin } from '@/utils/toku';
import HelpWindow from '../_shared/HelpWindow';
import MyFortuneView from './MyFortuneView';

interface Props {
  user: User;
  userItems: UserItems | undefined;
  isLoadingUserItems: boolean;
  setUser: (user: User) => void;
  mutateUserItems: () => void;
  handleCloseMenu: () => void;
}

const UserMenu: React.FC<Props> = (props) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [isOmikujiOpen, setIsOmikujiOpen] = useState(false);
  const [isOmamoriOpen, setIsOmamoriOpen] = useState(false);
  const [isEmaOpen, setIsEmaOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isFortuneOpen, setIsFortuneOpen] = useState(false);
  const [renameName, setRenameName] = useState(props.user.name || '');
  const inputRef = useRef<HTMLInputElement>(null);

  const emaCount =
    props.isLoadingUserItems || props.userItems === undefined ? 0 : props.userItems.ema.length;
  const omamoriCount =
    props.isLoadingUserItems || props.userItems === undefined ? 0 : props.userItems.omamori.length;
  const omikujiCount =
    props.isLoadingUserItems || props.userItems === undefined ? 0 : props.userItems.omikuji.length;

  const name = props.user.name || '名無し';

  const handleSignIn = async (provider: 'google' | 'github') => {
    // リダイレクトされるので戻さない
    setLoading(true);
    await signIn(provider);
  };

  const handleSignOut = async () => {
    // リダイレクトされるので戻さない
    setLoading(true);
    await apiFetch('/api/init', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    props.handleCloseMenu();
    props.mutateUserItems();
    await signOut();
  };

  const handleRenameEnter = () => {
    props.setUser({ ...props.user, name: renameName });
    setIsRenameOpen(false);
    apiFetch('/api/user/rename', {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: renameName }),
    });
  };

  useEffect(() => {
    if (isRenameOpen && inputRef.current) {
      setRenameName(props.user.name || '');
      inputRef.current.focus();
    }
  }, [isRenameOpen, props.user.name]);

  return (
    <div className="min-w-[18rem] text-black flex flex-col items-start p-2">
      <div className="w-full text-black/40 text-center font-bold">ニックネーム</div>
      <div className="w-full flex flex-row items-center justify-center">
        <Button
          variant="custom"
          size="custom"
          className=""
          onClick={() => setIsRenameOpen(true)}
          disabled={loading}
        >
          <Image src="/images/icon/icon_hude.webp" alt="edit_icon" width={24} height={24} />
        </Button>
        <div className="relative w-[10rem]">
          <div className="w-full text-black text-center">{name ? name : '名無し'}</div>
          <div className="absolute top-[1.5rem] left-0 w-full border-t border-black"></div>
        </div>
      </div>
      <div className="w-full border-t border-gray-200 my-4"></div>
      {session ? (
        <div className="w-full flex flex-col gap-2 items-center">
          <div className="text-black/40 text-sm font-bold">ログイン中</div>
          <Button
            variant="positive"
            size="sm"
            onClick={handleSignOut}
            className="w-[11rem]"
            disabled={loading}
          >
            ログアウト
          </Button>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-2 items-center">
          <div className="text-black/40 font-bold">ゲストで参拝中</div>
          <Button
            variant="positive"
            size="md"
            onClick={() => {
              setIsLoginOpen(true);
            }}
            className="w-[12rem]"
            disabled={loading}
          >
            ログイン
          </Button>
          <Button
            variant="positive"
            size="md"
            onClick={() => {
              setIsRegisterOpen(true);
            }}
            className="w-[12rem] flex flex-col"
            disabled={loading}
          >
            <div>新規登録</div>
            <div className="flex flex-row items-center">
              <Image
                src="/images/icon/icon_coin.webp"
                alt="omikuji_button"
                width={24}
                height={24}
              />
              <div className="text-yellow-400">{getTokuCoin('regist_reward')}獲得（初回）</div>
            </div>
          </Button>
        </div>
      )}
      <div className="w-full border-t border-gray-200 my-4"></div>
      <div className="w-full text-black/40 text-center font-bold">所持品</div>
      <div className="w-full flex flex-col gap-2">
        <MenuButton
          onClick={() => {
            setIsEmaOpen(true);
          }}
          disabled={loading || emaCount === 0}
        >
          <div className="h-7 flex flex-row items-center gap-1 text-lg">
            <Image
              src="/images/icon/icon_ema.webp"
              alt="ema_icon"
              width={64}
              height={64}
              className="h-full w-auto"
            />
            <div>絵馬({emaCount}個)</div>
          </div>
        </MenuButton>
        <MenuButton
          onClick={() => {
            setIsOmamoriOpen(true);
          }}
          disabled={loading || omamoriCount === 0}
        >
          <div className="h-7 flex flex-row items-center gap-1 text-lg">
            <Image
              src="/images/icon/icon_omamori.webp"
              alt="omamori_icon"
              width={64}
              height={64}
              className="h-full w-auto"
            />
            <div>お守り({omamoriCount}個)</div>
          </div>
        </MenuButton>
        <MenuButton onClick={() => setIsOmikujiOpen(true)} disabled={loading || omikujiCount === 0}>
          <div className="h-7 flex flex-row items-center gap-1 text-lg">
            <Image
              src="/images/icon/icon_omikuji.webp"
              alt="omikuji_icon"
              width={64}
              height={64}
              className="h-full w-auto"
            />
            <div>おみくじ({omikujiCount}個)</div>
          </div>
        </MenuButton>
      </div>

      <div className="w-full border-t border-gray-200 my-4"></div>
      <MenuButton
        onClick={() => {
          setIsFortuneOpen(true);
        }}
        disabled={loading || props.user.fortunes.length === 0}
      >
        <div className="h-7 flex flex-row items-center gap-1 text-lg">
          <Image
            src="/images/icon/icon_maneki.webp"
            alt="maneki_icon"
            width={64}
            height={64}
            className="h-full w-auto"
          />
          <div>運パラメータ</div>
        </div>
      </MenuButton>

      <Modal
        isOpen={isRenameOpen}
        className="absolute w-[16rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md border-2 border-gray-200"
        handleOutsideClick={() => setIsRenameOpen(false)}
      >
        <div className="p-4 flex flex-col items-center gap-4">
          <div className="text-black/40 text-sm font-bold">ニックネーム変更</div>
          <input
            type="text"
            className="w-full border-2 border-gray-500 rounded-md text-black p-1"
            value={renameName}
            ref={inputRef}
            onChange={(e) => setRenameName(e.target.value.replace(/\r?\n/g, ''))}
          />
          <div className="flex flex-row items-center gap-2">
            <Button variant="negative" onClick={() => setIsRenameOpen(false)} disabled={loading}>
              やめる
            </Button>
            <Button variant="positive" onClick={() => handleRenameEnter()} disabled={loading}>
              名前変更
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isLoginOpen}
        className="absolute w-[16rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md border-2 border-gray-200"
        handleOutsideClick={() => setIsLoginOpen(false)}
      >
        <div className="p-4 flex flex-col items-center gap-2">
          <div className="text-black/40 text-sm font-bold">ログイン</div>
          <Button
            variant="custom"
            className="text-black border-2 border-gray-200 hover:bg-gray-100 rounded-full flex flex-row items-center gap-2"
            onClick={() => handleSignIn('google')}
            disabled={loading}
          >
            <Image src="/images/icon/icon_google.svg" alt="google_icon" width={24} height={24} />
            Googleでログイン
          </Button>
          <Button
            variant="custom"
            className="text-black border-2 border-gray-200 hover:bg-gray-100 rounded-full flex flex-row items-center gap-2"
            onClick={() => handleSignIn('github')}
            disabled={loading}
          >
            <Image src="/images/icon/icon_github.svg" alt="github_icon" width={24} height={24} />
            GitHubでログイン
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={isRegisterOpen}
        className="absolute w-[16rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md border-2 border-gray-200"
        handleOutsideClick={() => setIsRegisterOpen(false)}
      >
        <div className="p-4 flex flex-col items-center gap-2">
          <div className="text-black/40 text-sm font-bold">新規登録</div>
          <Button
            variant="custom"
            className="text-black border-2 border-gray-200 hover:bg-gray-100 rounded-full flex flex-row items-center gap-2"
            onClick={() => handleSignIn('google')}
            disabled={loading}
          >
            <Image src="/images/icon/icon_google.svg" alt="google_icon" width={24} height={24} />
            Googleで登録
          </Button>
          <Button
            variant="custom"
            className="text-black border-2 border-gray-200 hover:bg-gray-100 rounded-full flex flex-row items-center gap-2"
            onClick={() => handleSignIn('github')}
            disabled={loading}
          >
            <Image src="/images/icon/icon_github.svg" alt="github_icon" width={24} height={24} />
            GitHubで登録
          </Button>
        </div>
      </Modal>

      <HelpWindow
        isOpen={isFortuneOpen}
        className="fixed w-[16rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md border-2 border-gray-200"
        handleOutsideClick={() => setIsFortuneOpen(false)}
      >
        <MyFortuneView user={props.user} onClose={() => setIsFortuneOpen(false)} />
      </HelpWindow>

      {props.userItems?.ema && (
        <Modal
          isOpen={isEmaOpen}
          className="absolute top-0 left-0 min-h-[100lvh] min-w-[100vw] bg-transparent overscroll-contain"
        >
          <MyEmaView emaPostResponses={props.userItems?.ema} onClose={() => setIsEmaOpen(false)} />
        </Modal>
      )}
      {props.userItems?.omikuji && (
        <Modal
          isOpen={isOmikujiOpen}
          className="absolute top-0 left-0 min-h-[100lvh] min-w-[100vw] bg-transparent overscroll-contain"
        >
          <MyOmikujiView
            omikujiResponses={props.userItems?.omikuji}
            onClose={() => setIsOmikujiOpen(false)}
          />
        </Modal>
      )}
      {props.userItems?.omamori && (
        <Modal
          isOpen={isOmamoriOpen}
          className="absolute top-0 left-0 min-h-[100lvh] min-w-[100vw] bg-transparent overscroll-contain"
        >
          <MyOmamoriView
            omamoriResponses={props.userItems?.omamori}
            onClose={() => setIsOmamoriOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default UserMenu;
