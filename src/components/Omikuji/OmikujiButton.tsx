import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/_shared/Button';
import { OmikujiType } from '@/types/omikuji';

type Props = {
  title: string;
  imagePath: string;
  imageAlt: string;
  onClick: (type: OmikujiType) => void;
  type: OmikujiType;
  coin: number;
};

export default function OmikujiButton({ title, imagePath, imageAlt, onClick, type, coin }: Props) {
  return (
    <div className="w-full max-w-md">
      <div className="flex flex-row justify-center items-end">
        <div className="text-xl font-bold">{title}</div>
        <div className="text-sm font-bold">の運勢</div>
      </div>
      <Image src={imagePath} alt={imageAlt} width={256} height={256} />
      <Button
        variant="positive"
        size="lg"
        onClick={() => onClick(type)}
        className="w-full max-w-md flex flex-col pt-2 pb-2 pl-0 pr-0"
      >
        <div className="text-xl font-bold">引く</div>
        <div className="flex flex-row items-center">
          <Image src="/images/icon/icon_coin.webp" alt="omikuji_button" width={24} height={24} />
          <div className="text-sm text-white font-bold">{coin}消費</div>
        </div>
      </Button>
    </div>
  );
}
