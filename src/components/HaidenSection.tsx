'use client';

const HaidenSection = () => {
  const handlePostWish = () => {
    alert(`賽銭を投げました`);
  };

  return (
    <section
      className="w-[300px] h-[400px] bg-black items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <h2 className="text-4xl font-bold mb-4">拝殿</h2>
      <p className="text-xl mb-4">拝殿のコンテンツ</p>

      <button className="bg-indigo-600 px-4 py-2 rounded" onClick={handlePostWish}>
        賽銭を投げる
      </button>
    </section>
  );
};

export default HaidenSection;
