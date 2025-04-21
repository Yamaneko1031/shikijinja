'use client';

export default function AdminTopPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">管理画面トップ</h1>
      <p className="text-gray-600">ここから神様や絵馬の管理ができます。</p>

      <ul className="mt-6 space-y-2">
        <li>
          <a href="/admin/deity" className="text-blue-500 hover:underline">
            🐾 神様の管理ページへ
          </a>
        </li>
        <li>
          <a href="/admin/ema" className="text-blue-500 hover:underline">
            📝 絵馬の一覧ページへ
          </a>
        </li>
      </ul>
    </div>
  );
}
