'use client';

import React, { useState } from 'react';
// import Image from 'next/image';
import { User } from '@/types/user';

import { signIn, signOut, useSession } from 'next-auth/react';
import { apiFetch } from '@/lib/api';
import { Button } from '../_shared/Button';

interface HeaderProps {
  user: User;
  handleCloseMenu: () => void;
}

const HeaderMenu: React.FC<HeaderProps> = (props) => {
  const { data: session } = useSession();
  const [cookieUserId, setCookieUserId] = useState<string>('');

  const handleClickCookie = async () => {
    const res = await apiFetch<{ userId: string }>('/api/debug/cookie');
    setCookieUserId(res.userId);
  };

  const handleSignOut = async () => {
    // クッキーを削除してからサインアウト
    await apiFetch('/api/user/init', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    signOut();
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <Button variant="subNatural" onClick={handleClickCookie}>
        cookieのUserIdを取得:{cookieUserId}
      </Button>
      {session ? (
        <div className="flex flex-col gap-2">
          <p>ログイン中：{session.user?.name}</p>
          <Button variant="subNatural" onClick={handleSignOut}>
            ログアウト
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Button variant="subNatural" onClick={() => signIn('google')}>
            Googleでログイン
          </Button>
          {/* <Button variant="subNatural" onClick={() => signIn('twitter')}>
            Xでログイン
          </Button> */}
          <Button variant="subNatural" onClick={() => signIn('github')}>
            GitHubでログイン
          </Button>
        </div>
      )}
      <Button variant="negative" onClick={props.handleCloseMenu}>
        閉じる
      </Button>
    </div>
  );
};

export default HeaderMenu;
