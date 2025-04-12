'use client';

const ShoukaiSection = () => {
  const handlePostWish = () => {
    alert(`神様の紹介を見ました`);
  };

  return (
    <section
      className="w-[300px] h-[400px] bg-black items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <h2 className="text-4xl font-bold mb-4">神様の紹介</h2>
      <p className="text-xl mb-4">式岐神社に祀られている神様の紹介</p>

      <button className="bg-indigo-600 px-4 py-2 rounded" onClick={handlePostWish}>
        神様の紹介を見る
      </button>
    </section>
  );
};

export default ShoukaiSection;
