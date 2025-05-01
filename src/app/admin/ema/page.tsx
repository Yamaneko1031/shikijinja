'use client';

import { EmaPostResponse } from '@/types/ema';
import useSWR from 'swr';

export default function EmaNonAllowPostsPage() {
  const {
    data: emaPosts,
    error,
    isLoading,
  } = useSWR<EmaPostResponse[]>('/api/ema?decision=BLOCK', (url: string) =>
    fetch(url).then((res) => res.json())
  );

  const {
    data: emaPostsAllow,
    error: errorAllow,
    isLoading: isLoadingAllow,
  } = useSWR<EmaPostResponse[]>('/api/ema', (url: string) => fetch(url).then((res) => res.json()));

  if (error || errorAllow) return <p className="text-red-500">絵馬の取得に失敗しました。</p>;
  if (isLoading || isLoadingAllow) return <p>読み込み中…</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">ALLOW以外の絵馬一覧</h1>
      {emaPosts == null || emaPosts.length === 0 ? (
        <p>ALLOW以外の絵馬はありません。</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Texts</th>
                <th className="py-2 px-4 border-b">Reply</th>
                <th className="py-2 px-4 border-b">Decision</th>
                <th className="py-2 px-4 border-b">Reasons</th>
                <th className="py-2 px-4 border-b">Ema Image</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {emaPosts.map((post, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">
                    {post.texts[0].text}
                    {post.texts[1].text}
                  </td>
                  <td className="py-2 px-4 border-b">{post.reply}</td>
                  <td className="py-2 px-4 border-b">{post.decision}</td>
                  <td className="py-2 px-4 border-b">{post.reasons}</td>
                  <td className="py-2 px-4 border-b">{post.emaImage}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={async () => {
                        try {
                          const response = await fetch(`/api/ema/${post.id}`, {
                            method: 'PATCH',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ decision: 'ALLOW' }),
                          });
                          if (response.ok) {
                            alert('絵馬がALLOWに設定されました。');
                          } else {
                            console.error('絵馬の更新に失敗しました。');
                          }
                        } catch (error) {
                          console.error('絵馬の更新中にエラーが発生しました。', error);
                        }
                      }}
                    >
                      ALLOWにする
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">ALLOWに設定された絵馬一覧</h2>
        <table className="min-w-full bg-gray-700">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Texts</th>
              <th className="py-2 px-4 border-b">Reply</th>
              <th className="py-2 px-4 border-b">Decision</th>
              <th className="py-2 px-4 border-b">Reasons</th>
              <th className="py-2 px-4 border-b">Ema Image</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {emaPostsAllow?.map((post, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">
                  {post.texts[0].text}
                  {post.texts[1].text}
                </td>
                <td className="py-2 px-4 border-b">{post.reply}</td>
                <td className="py-2 px-4 border-b">{post.decision}</td>
                <td className="py-2 px-4 border-b">{post.reasons}</td>
                <td className="py-2 px-4 border-b">{post.emaImage}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={async () => {
                      try {
                        const response = await fetch(`/api/ema/${post.id}`, {
                          method: 'PATCH',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ decision: 'BLOCK' }),
                        });
                        if (response.ok) {
                          alert('絵馬がBLOCKに設定されました。');
                        } else {
                          console.error('絵馬の更新に失敗しました。');
                        }
                      } catch (error) {
                        console.error('絵馬の更新中にエラーが発生しました。', error);
                      }
                    }}
                  >
                    BLOCKにする
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
