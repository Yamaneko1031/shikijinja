// components/OmikujiSelector.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/_shared/Button';
import RadioButtons from '../_shared/RadioButtons';
import { omikujiJobRadioOptions } from '@/config/omikuji';

interface OmikujiSelectorProps {
  onSelect: (job: string) => void;
  onCancel: () => void;
}

export default function OmikujiJobSelector({ onSelect, onCancel }: OmikujiSelectorProps) {
  const [jobInput, setJobInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (selectedOption === 'other') {
      if (textareaRef.current) {
        textareaRef.current.blur();
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
          }
        });
      }
    } else {
      const job = omikujiJobRadioOptions.find((option) => option.value === selectedOption)?.label;
      if (job) {
        setJobInput(job);
      }
    }
  }, [selectedOption]);

  return (
    <div className="flex flex-col items-center gap-2 py-2 px-4">
      <h2 className="text-xl font-bold">職業を教えてください</h2>
      <p className="text-xs text-gray-500">職業に応じたおみくじが引けます</p>

      <RadioButtons
        name="omikuji-selector"
        options={omikujiJobRadioOptions}
        value={selectedOption}
        onChange={(value) => setSelectedOption(value)}
      />
      <div className="w-full px-4 flex flex-col gap-1">
        <p className="text-xs text-gray-500">記入欄</p>
        <textarea
          ref={textareaRef}
          className="w-full p-2 rounded-md bg-gray-100 text-black resize-none focus:bg-gray-200 focus:outline-none focus:ring-gray-400 transition-all duration-200"
          maxLength={20}
          rows={1}
          value={jobInput}
          onChange={(e) => {
            setJobInput(e.target.value);
            if (e.target.value.length > 12) {
              e.target.value = e.target.value.slice(0, 12);
            }
          }}
          readOnly={selectedOption !== 'other'}
        />
      </div>
      <div className="w-full border-t border-black"></div>
      <div className="flex flex-row justify-center gap-2 w-full">
        <Button variant="negative" size="md" onClick={onCancel}>
          やめる
        </Button>
        <Button
          variant="positive"
          size="md"
          onClick={() => onSelect(jobInput)}
          disabled={jobInput === ''}
        >
          引く
        </Button>
      </div>
    </div>
  );
}
