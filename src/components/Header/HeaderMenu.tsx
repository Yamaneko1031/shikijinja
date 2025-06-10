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

interface HeaderProps {
  user: User;
  userItems: UserItems | undefined;
  isLoadingUserItems: boolean;
  mutateUserItems: () => void;
  handleCloseMenu: () => void;
}

const HeaderMenu: React.FC<HeaderProps> = (props) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [isOmikujiOpen, setIsOmikujiOpen] = useState(false);
  const [isOmamoriOpen, setIsOmamoriOpen] = useState(false);
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
          <Button
            variant="subNatural"
            onClick={() => {}}
            disabled={loading || props.isLoadingUserItems || props.userItems?.ema.length === 0}
          >
            絵馬{props.userItems?.ema.length}
          </Button>
          <Button
            variant="subNatural"
            onClick={() => {
              setIsOmamoriOpen(true);
            }}
            disabled={loading || props.isLoadingUserItems || props.userItems?.omamori.length === 0}
          >
            お守り{props.userItems?.omamori.length}
          </Button>
          <Button
            variant="subNatural"
            onClick={() => setIsOmikujiOpen(true)}
            disabled={loading || props.isLoadingUserItems || props.userItems?.omikuji.length === 0}
          >
            おみくじ{props.userItems?.omikuji.length}
          </Button>
        </div>
      )}
      <Button variant="negative" onClick={props.handleCloseMenu} disabled={loading}>
        閉じる
      </Button>

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

export default HeaderMenu;
