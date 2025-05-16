// components/OmikujiSelector.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/_shared/Button';
import { omikujiDefaultJob } from '@/config/omikuji';

interface OmikujiSelectorProps {
  onSelect: (job: string) => void;
  onCancel: () => void;
}

export default function OmikujiSelector({ onSelect, onCancel }: OmikujiSelectorProps) {
  const [customJobInput, setCustomJobInput] = useState('');

  return (
    <div className="flex flex-col gap-4 items-center w-[340px] p-2">
      <h2 className="text-xl font-bold">職業を選択してください</h2>
      <div className="w-full flex flex-col gap-4">
        {omikujiDefaultJob.map((job) => (
          <Button
            className="rounded-lg bg-white/10 hover:bg-white/20"
            variant="custom"
            key={job}
            onClick={() => onSelect(job)}
          >
            {job}
          </Button>
        ))}
        <div className="flex flex-row gap-2 w-full">
          <textarea
            className="w-full p-2 rounded-lg bg-white/10 text-white placeholder-gray-400 resize-none"
            placeholder="自由入力"
            rows={1}
            value={customJobInput}
            onChange={(e) => setCustomJobInput(e.target.value)}
          />
          <Button
            className="w-1/3 rounded-lg bg-white/10 hover:bg-white/20"
            variant="positive"
            onClick={() => {
              if (customJobInput.trim() !== '') {
                onSelect(customJobInput.trim());
              }
            }}
            disabled={customJobInput.trim() === ''}
          >
            決定
          </Button>
        </div>
      </div>
      <Button variant="negative" size="md" onClick={onCancel}>
        やめる
      </Button>
    </div>
  );
}
