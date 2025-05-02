// src/contexts/DialogCountContext.tsx
'use client';
import { createContext } from 'react';

export const DialogCountContext = createContext<{ current: number }>({ current: 0 });
