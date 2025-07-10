import Image from 'next/image';
import { Button } from '../_shared/Button';
import { getTokuMaster } from '@/utils/toku';
import { TokuId } from '@/types/toku';
import Modal from '../_shared/Modal';
import OmamoriList from './OmamoriList';
import { useState } from 'react';
import { useOmamoriList } from '@/hooks/useOmamoriList';
import { UserItems } from '@/types/user';

interface Props {
  handlePurchase: () => void;
  handleIsEnoughCoin: (tokuId: TokuId) => boolean;
  userItems: UserItems | undefined;
}

export default function OmamoriWindow(props: Props) {
  const tokudata = getTokuMaster('omamori_buy');
  const [omamoriListOpen, setOmamoriListOpen] = useState(false);
  const { omamoriList, error, isLoading } = useOmamoriList();

  const purchase = () => {
    if (tokudata) {
      if (!props.handleIsEnoughCoin(tokudata.tokuId)) {
        alert(`徳が足りません。\n${tokudata.label}は1回${tokudata.coin}徳です。`);
        return;
      }
      props.handlePurchase();
    }
  };

  return (
    <div className="relative w-full bg-black/50 rounded-lg flex flex-col items-center gap-2 p-4">
      <div className="text-xl flex flex-col gap-4 items-start">
        <p>
          みこ猫があなたに必要なお守りを（適当に）選び、そのお守りに祈りを捧げることで様々な効能を付与してくれます。
        </p>
        <p>※同じ種類のお守りでも付与される効能は毎回変わります。</p>
      </div>
      <Button
        variant="positive"
        size="lg"
        onClick={() => setOmamoriListOpen(true)}
        className="w-full max-w-md flex flex-col pt-2 pb-2 pl-0 pr-0"
      >
        <div className="text-xl font-bold">お守り一覧</div>
      </Button>
      <Button
        variant="positive"
        size="lg"
        onClick={() => purchase()}
        className="w-full max-w-md flex flex-col pt-2 pb-2 pl-0 pr-0"
      >
        <div className="text-xl font-bold">買う</div>
        <div className="flex flex-row items-center">
          <Image src="/images/icon/icon_coin.webp" alt="omikuji_button" width={24} height={24} />
          <div className="text-sm text-white font-bold">{tokudata?.coin}消費</div>
        </div>
      </Button>

      <Modal
        isOpen={omamoriListOpen}
        className="absolute max-w-2xl min-w-[20rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black rounded-md border-2 border-gray-200 overscroll-contain"
      >
        <OmamoriList
          onClose={() => setOmamoriListOpen(false)}
          omamoriList={omamoriList}
          isError={error}
          isLoading={isLoading}
          userItems={props.userItems}
        />
      </Modal>
    </div>
  );
}
