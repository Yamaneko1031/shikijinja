export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-300 to-orange-100">
      <div className="text-center space-y-6">
        {/* タイトル */}
        <div>
          <h1 className="text-3xl font-bold text-red-800 mb-2">式岐神社</h1>
          <p className="text-red-800">読み込み中...</p>
        </div>

        {/* ドットアニメーション */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-red-800 rounded-full animate-bounce"></div>
          <div
            className="w-3 h-3 bg-red-800 rounded-full animate-bounce"
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className="w-3 h-3 bg-red-800 rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>
      </div>
    </div>
  );
}
