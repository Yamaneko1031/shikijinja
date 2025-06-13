'use client';

import React, { useState } from 'react';
// import Image from 'next/image';
import { User, UserItems } from '@/types/user';

import { signIn, signOut, useSession } from 'next-auth/react';
import { apiFetch } from '@/lib/api';
import { Button } from '../_shared/Button';
import Modal from '../_shared/Modal';
import MyOmikujiView from './MyOmikujiView';
import MyOmamoriView from './MyOmamoriView';
import MyEmaView from './MyEmaView';

interface Props {
  user: User;
  userItems: UserItems | undefined;
  isLoadingUserItems: boolean;
  mutateUserItems: () => void;
  handleCloseMenu: () => void;
}

const UserMenu: React.FC<Props> = (props) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [isOmikujiOpen, setIsOmikujiOpen] = useState(false);
  const [isOmamoriOpen, setIsOmamoriOpen] = useState(false);
  const [isEmaOpen, setIsEmaOpen] = useState(false);

  const emaCount =
    props.isLoadingUserItems || props.userItems === undefined ? 0 : props.userItems.ema.length;
  const omamoriCount =
    props.isLoadingUserItems || props.userItems === undefined ? 0 : props.userItems.omamori.length;
  const omikujiCount =
    props.isLoadingUserItems || props.userItems === undefined ? 0 : props.userItems.omikuji.length;

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

  return (
    <div className="flex flex-col gap-2 items-center">
      {session ? (
        <div className="flex flex-col gap-2">
          <p>ログイン中：{session.user?.name}</p>
          <Button variant="subNatural" onClick={handleSignOut} disabled={loading}>
            ログアウト
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Button variant="subNatural" onClick={() => handleSignIn('google')} disabled={loading}>
            Googleでログイン
          </Button>
          {/* <Button variant="subNatural" onClick={() => signIn('twitter')}>
            Xでログイン
          </Button> */}
          <Button variant="subNatural" onClick={() => handleSignIn('github')} disabled={loading}>
            GitHubでログイン
          </Button>
        </div>
      )}
      <Button
        variant="subNatural"
        onClick={() => {
          setIsEmaOpen(true);
        }}
        disabled={loading || emaCount === 0}
      >
        絵馬{emaCount}
      </Button>
      <Button
        variant="subNatural"
        onClick={() => {
          setIsOmamoriOpen(true);
        }}
        disabled={loading || omamoriCount === 0}
      >
        お守り{omamoriCount}
      </Button>
      <Button
        variant="subNatural"
        onClick={() => setIsOmikujiOpen(true)}
        disabled={loading || omikujiCount === 0}
      >
        おみくじ{omikujiCount}
      </Button>
      <Button variant="negative" onClick={props.handleCloseMenu} disabled={loading}>
        閉じる
      </Button>

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
