// src/contexts/DialogCountContext.tsx
'use client';
import { createContext, Dispatch, SetStateAction } from 'react';

export type DialogCountContextType = [number, Dispatch<SetStateAction<number>>];
export const DialogCountContext = createContext<DialogCountContextType>([0, () => {}]);
