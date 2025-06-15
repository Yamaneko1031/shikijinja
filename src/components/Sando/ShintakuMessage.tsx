import { shintakuTypeTable } from '@/config/shintaku';
import { ShintakuPost } from '@/types/shintaku';
import Image from 'next/image';
interface ShintakuMessageProps {
  message: ShintakuPost;
}

export default function ShintakuMessage({ message }: ShintakuMessageProps) {
  const shintakuTypeData = shintakuTypeTable[message.imageKey];
  const date = new Date(message.createdAt);
  return (
    <div className="text-black flex items-start p-4">
      <div className="w-18 flex flex-col items-center">
        <div className="w-18 h-18 overflow-hidden rounded-md border-3 border-[rgba(40,20,0,0.5)]">
          <Image
            src={`/images/illust/${shintakuTypeData.illustname}`}
            alt={shintakuTypeData.label}
            width={100}
            height={100}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center text-sm">{shintakuTypeData.label}</div>
      </div>
      <div className="flex flex-col gap-1 ml-2 mr-8">
        <div className="w-full h-full p-2 bg-[#F6F2E6] rounded-md">
          <div className="text-start text-xl">{message.message}</div>
        </div>
        <div className="w-full text-end pr-2 text-xs">
          <p>
            {date.getMonth() + 1}月{date.getDate()}日 {date.getHours()}時
          </p>
        </div>
      </div>
    </div>
  );
}
