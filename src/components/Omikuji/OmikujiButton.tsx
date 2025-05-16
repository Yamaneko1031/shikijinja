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
};

export default function OmikujiButton({ title, imagePath, imageAlt, onClick, type }: Props) {
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
        className="w-full max-w-md"
      >
        引く
      </Button>
    </div>
  );
}
