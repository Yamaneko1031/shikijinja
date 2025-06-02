import { useState } from 'react';
import { OmamoriData } from '@/types/omamori';
import Image from 'next/image';
import { Button } from '../_shared/Button';
import { baseOmamoriList } from '@/config/omamori';
import { getTokuMaster } from '@/utils/toku';
import { TokuId } from '@/types/toku';

interface Props {
  handlePurchase: (selectedOmamori: OmamoriData) => void;
  handleIsEnoughCoin: (tokuId: TokuId) => boolean;
}

export default function OmamoriWindow(props: Props) {
  const [selectedOmamori, setSelectedOmamori] = useState<OmamoriData>(baseOmamoriList[0]);

  const purchase = (selectedOmamori: OmamoriData) => {
    const tokudata = getTokuMaster('omamori_buy');
    if (tokudata) {
      if (!props.handleIsEnoughCoin(tokudata.tokuId)) {
        alert(`徳が足りません。\n${tokudata.label}は1回${tokudata.coin}徳です。`);
        return;
      }
      props.handlePurchase(selectedOmamori);
    }
  };

  return (
    <div className="relative w-full bg-black/50 rounded-lg flex flex-col items-center gap-2 p-4">
      <div className="w-full flex flex-row gap-4 justify-center">
        {baseOmamoriList.map((omamori) => (
          <div key={omamori.name}>
            <Image src={omamori.imageUrl} alt={omamori.name} width={100} height={100} />
          </div>
        ))}
      </div>
      <div className="w-full flex flex-row gap-4 justify-center">
        <div className="min-w-[8rem] max-w-[12rem] flex justify-center items-center">
          <Image
            src={selectedOmamori.imageUrl}
            alt={selectedOmamori.name}
            width={200}
            height={300}
          />
        </div>
        <div className="max-w-[20rem] flex flex-col justify-items-start items-center gap-2">
          <div className="w-full text-2xl font-bold text-left">【{selectedOmamori.name}】</div>
          <div className="w-full h-full text-md text-left whitespace-pre-line">
            {selectedOmamori.description}
          </div>
          <div className="w-full text-md text-left whitespace-pre-line">
            <Button
              variant="positive"
              size="lg"
              onClick={() => purchase(selectedOmamori)}
              className="w-full max-w-md flex flex-col pt-2 pb-2 pl-0 pr-0"
            >
              <div className="text-xl font-bold">買う</div>
              <div className="flex flex-row items-center">
                <Image
                  src="/images/icon/icon_coin.webp"
                  alt="omikuji_button"
                  width={24}
                  height={24}
                />
                <div className="text-sm text-white font-bold">{selectedOmamori.price}消費</div>
              </div>
            </Button>
          </div>
          {/* {selectedOmamori.effects.map((effect) => (
          <div key={effect.name}>
            <div className="text-sm">
              {effect.name + ' '}
              {'★'.repeat(effect.power)}
              {'☆'.repeat(10 - effect.power)}
            </div>
          </div>
        ))} */}
        </div>
        <div className="absolute top-0 left-0">
          <Button
            variant="subNatural"
            size="sm"
            onClick={() => {
              const currentIndex = baseOmamoriList.findIndex(
                (o) => o.name === selectedOmamori.name
              );
              const newIndex = (currentIndex - 1 + baseOmamoriList.length) % baseOmamoriList.length;
              setSelectedOmamori(baseOmamoriList[newIndex]);
            }}
            className="bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full"
          >
            ←
          </Button>
        </div>
        <div className="absolute top-0 right-0">
          <Button
            variant="subNatural"
            size="sm"
            onClick={() => {
              const currentIndex = baseOmamoriList.findIndex(
                (o) => o.name === selectedOmamori.name
              );
              const newIndex = (currentIndex + 1) % baseOmamoriList.length;
              setSelectedOmamori(baseOmamoriList[newIndex]);
            }}
            className="bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full"
          >
            →
          </Button>
        </div>
      </div>
    </div>
  );
}
