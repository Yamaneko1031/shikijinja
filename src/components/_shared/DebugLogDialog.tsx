'use client';

import { useDebugLog } from '@/hooks/useDebugLog';
import { apiFetch } from '@/lib/api';
import { getAppTime } from '@/lib/appTime';
import { useState } from 'react';
import { TokuId } from '@/types/toku';
import { postSlackError } from '@/lib/slack';
import { User } from '@/types/user';

interface Props {
  user: User;
  handleTokuGet: (tokuId: TokuId) => void;
  handleTokuUsed: (tokuId: TokuId) => void;
}

export default function DebugLogDialog({ user, handleTokuGet, handleTokuUsed }: Props) {
  const { addLog, logs, clearLogs } = useDebugLog();
  const [isOpen, setIsOpen] = useState(false);
  const [appTime, setAppTime] = useState<Date | null>(null);
  const [cookieUserId, setCookieUserId] = useState<string>('');

  const cookieInit = async () => {
    apiFetch('/api/init', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    setCookieUserId('');
  };

  const cookieUserIdGet = async () => {
    const res = await apiFetch<{ userId: string }>('/api/debug/cookie');
    setCookieUserId(res.userId);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-black text-white px-3 py-1 rounded shadow z-60"
      >
        Debug
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 text-white flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg max-w-[90vw] max-h-[80vh] overflow-auto relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-white hover:text-red-400"
            >
              x
            </button>
            <button
              onClick={clearLogs}
              className="text-sm text-yellow-300 mb-4 hover:text-yellow-400"
            >
              🔄 Clear Logs
            </button>
            <button
              onClick={() => setAppTime(getAppTime())}
              className="text-sm text-yellow-300 mb-4 hover:text-yellow-400"
            >
              🔄 Get App Time
            </button>
            <button
              onClick={cookieUserIdGet}
              className="text-sm text-yellow-300 mb-4 hover:text-yellow-400"
            >
              🔄 UserId
            </button>
            <button
              onClick={cookieInit}
              className="text-sm text-yellow-300 mb-4 hover:text-yellow-400"
            >
              🔄 Cookie削除
            </button>
            <button
              onClick={() => handleTokuGet('debug_add')}
              className="text-sm text-yellow-300 mb-4 hover:text-yellow-400"
            >
              🔄 Coin取得
            </button>
            <button
              onClick={() => handleTokuUsed('debug_sub')}
              className="text-sm text-yellow-300 mb-4 hover:text-yellow-400"
            >
              🔄 Coin消費
            </button>
            <button
              onClick={() => postSlackError(logs.join('\n'))}
              className="text-sm text-yellow-300 mb-4 hover:text-yellow-400"
            >
              🔄 Slack送信
            </button>
            <button
              onClick={() => addLog(JSON.stringify(user))}
              className="text-sm text-yellow-300 mb-4 hover:text-yellow-400"
            >
              🔄 User
            </button>
            <a href="/admin" className="text-blue-500 hover:underline">
              admin
            </a>

            {appTime && (
              <p className="text-sm text-gray-400 mb-4">App Time: {appTime.toLocaleString()}</p>
            )}
            {cookieUserId && (
              <p className="text-sm text-gray-400 mb-4">Cookie UserId: {cookieUserId}</p>
            )}

            <h2 className="text-xl mb-2 font-bold">Debug Logs</h2>
            <ul className="text-sm whitespace-pre-wrap space-y-1 max-w-full break-words">
              {logs.length > 0 ? (
                logs.map((log, index) => <li key={index}>{log}</li>)
              ) : (
                <li className="text-gray-400">ログはありません</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
