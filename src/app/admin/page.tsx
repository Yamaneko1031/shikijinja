'use client';

import Link from 'next/link';

export default function AdminTopPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">管理画面トップ</h1>
      <p className="text-gray-600">ここから神様や絵馬の管理ができます。</p>

      <ul className="mt-6 space-y-2">
        <li>
          <Link href="/" className="text-blue-500 hover:underline">
            神社へ
          </Link>
        </li>
        <li>
          <Link href="/admin/prompt" className="text-blue-500 hover:underline">
            🐾 プロンプトの管理ページへ
          </Link>
        </li>
        <li>
          <Link href="/admin/ema" className="text-blue-500 hover:underline">
            📝 絵馬の一覧ページへ
          </Link>
        </li>
        <li>
          <Link href="/admin/shintaku" className="text-blue-500 hover:underline">
            � ご神託の一覧ページへ
          </Link>
        </li>
        <li>
          <Link href="/admin/trial" className="text-blue-500 hover:underline">
            🔄 お試しページへ
          </Link>
        </li>
      </ul>
    </div>
  );
}
