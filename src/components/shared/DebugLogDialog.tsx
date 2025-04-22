'use client';

import { useDebugLog } from '@/hooks/useDebugLog';
import { useState } from 'react';

export default function DebugLogDialog() {
  const { logs, clearLogs } = useDebugLog();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-black text-white px-3 py-1 rounded shadow"
      >
        🔧 Logs
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
            <h2 className="text-xl mb-2 font-bold">Debug Logs</h2>
            <button
              onClick={clearLogs}
              className="text-sm text-yellow-300 mb-4 hover:text-yellow-400"
            >
              🔄 Clear Logs
            </button>
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
