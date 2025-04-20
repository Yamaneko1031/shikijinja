'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type DebugLogContextType = {
  logs: string[];
  addLog: (msg: string) => void;
  clearLogs: () => void;
};

const DebugLogContext = createContext<DebugLogContextType | undefined>(undefined);

export const DebugLogProvider = ({ children }: { children: ReactNode }) => {
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

export const useDebugLog = (): DebugLogContextType => {
  const ctx = useContext(DebugLogContext);
  if (!ctx) throw new Error('useDebugLog must be used within DebugLogProvider');
  return ctx;
};
