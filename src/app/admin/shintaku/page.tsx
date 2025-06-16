'use client';

import { ShintakuResponse } from '@/types/shintaku';
import useSWR from 'swr';

export default function ShintakuPage() {
  const {
    data: shintakuPosts,
    error,
    isLoading,
  } = useSWR<ShintakuResponse>('/api/shintaku', (url: string) =>
    fetch(url).then((res) => res.json())
  );

  if (error) return <p className="text-red-500">ご神託の取得に失敗しました。</p>;
  if (isLoading) return <p>読み込み中…</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">ご神託一覧</h1>
      {shintakuPosts == null ? (
        <p>ご神託はありません。</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">message</th>
                <th className="py-2 px-4 border-b">imageKey</th>
                <th className="py-2 px-4 border-b">isReply</th>
                <th className="py-2 px-4 border-b">createdAt</th>
              </tr>
            </thead>
            <tbody>
              {shintakuPosts.posts.map((post, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{post.message}</td>
                  <td className="py-2 px-4 border-b">{post.imageKey}</td>
                  <td className="py-2 px-4 border-b">{post.isReply}</td>
                  <td className="py-2 px-4 border-b">{post.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-8">
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded"
          onClick={async () => {
            try {
              const response = await fetch(`/api/shintaku/auto`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
                // body: JSON.stringify({ key: 'iroha' }),
              });
              if (response.ok) {
                alert('ご神託が投稿されました。');
              } else {
                console.error('ご神託の投稿に失敗しました。');
              }
            } catch (error) {
              console.error('ご神託の投稿中にエラーが発生しました。', error);
            }
          }}
        >
          ご神託を投稿する
        </button>
      </div>
    </div>
  );
}
