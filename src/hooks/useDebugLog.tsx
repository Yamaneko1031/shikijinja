'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type DebugLogContextType = {
  logs: string[];
  addLog: (msg: string) => void;
  clearLogs: () => void;
};

const DebugLogContext = createContext<DebugLogContextType | undefined>(undefined);

// 開発環境用のプロバイダー
const DevelopmentDebugLogProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = useCallback((msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }, []);

  const clearLogs = () => setLogs([]);

  return (
    <DebugLogContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </DebugLogContext.Provider>
  );
};

// 本番環境用のプロバイダー（何もしない）
const ProductionDebugLogProvider = ({ children }: { children: ReactNode }) => {
  const mockValue: DebugLogContextType = {
    logs: [],
    addLog: () => {},
    clearLogs: () => {},
  };

  return <DebugLogContext.Provider value={mockValue}>{children}</DebugLogContext.Provider>;
};

// 環境に応じてプロバイダーを切り替え
export const DebugLogProvider =
  process.env.NODE_ENV === 'production' ? ProductionDebugLogProvider : DevelopmentDebugLogProvider;

export const useDebugLog = (): DebugLogContextType => {
  const ctx = useContext(DebugLogContext);
  if (!ctx) throw new Error('useDebugLog must be used within DebugLogProvider');
  return ctx;
};
