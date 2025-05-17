import React from 'react';
// import Image from 'next/image';
const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full h-[40px] bg-white z-50">
      <div className="flex items-center justify-center">
        <div className="left-0 w-[280px] h-[50px] flex items-center justify-center">
          {/* <Image src="/images/icon/icon_logo.webp" alt="式岐神社" width={40} height={40} /> */}
          <h1 className="text-2xl text-black font-bold">式岐神社</h1>
          <span className="ml-2 text-xs text-gray-600">SHIKI JINJA</span>
        </div>
        <div className="w-full h-full"></div>
      </div>
    </header>
  );
};

export default Header;
