import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full h-[40px] bg-white z-50">
      <div className="flex items-center justify-center">
        <h1 className="w-[140px] h-[40px] text-2xl text-black text-center font-bold flex items-center justify-center">
          式岐神社
        </h1>
        <div className="w-full h-full"></div>
      </div>
    </header>
  );
};

export default Header;
