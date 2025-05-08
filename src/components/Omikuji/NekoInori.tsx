import React, { useEffect, useState } from 'react';
import Image from 'next/image';
const NekoInori: React.FC = () => {
  const [nekoFrame, setNekoFrame] = useState<0 | 1>(0);

  useEffect(() => {
    const id = setInterval(() => {
      setNekoFrame((prev) => (prev === 0 ? 1 : 0));
    }, 600);
    return () => clearInterval(id);
  }, []);

  return (
    <Image
      src={`/images/omikuji/neko_inori${nekoFrame}.webp`}
      alt="neko_inori"
      width={200}
      height={200}
    />
  );
};

export default NekoInori;
