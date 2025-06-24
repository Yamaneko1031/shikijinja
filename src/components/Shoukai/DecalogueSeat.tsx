'use client';

import React from 'react';
// import Image from 'next/image';
import { decalogueTable } from '@/config/decalogue';

type Props = {
  page: number;
};

export default function DecalogueSeat({ page }: Props) {
  return (
    <div className="relative w-[25rem] h-[47.5rem] bg-[url('/images/bg_hude/bg_decalogue_page.webp')] bg-[length:100%]">
      <div className="absolute top-45.5 left-21 w-[15rem] flex flex-col gap-4 text-black/90">
        <div className="pl-13 text-2xl font-bold">式岐神社 十戒</div>
        <ul className="flex flex-col gap-4">
          {decalogueTable.slice(page * 2, (page + 1) * 2).map((decalogue) => (
            <li key={decalogue.text}>
              <div className="font-bold flex flex-row gap-1 ">
                <span>{decalogue.title}.</span>
                <span className="whitespace-pre-line">{decalogue.text}</span>
              </div>
              <div className="p-2 text-sm">{decalogue.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
