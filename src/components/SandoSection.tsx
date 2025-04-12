'use client';

const SandoSection = () => {
  const handlePostWish = () => {
    alert(`参拝マナーを見ました`);
  };

  return (
    <section
      className="w-[300px] h-[400px] bg-black items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <h2 className="text-4xl font-bold mb-4">式岐神社へ</h2>
      <p className="text-xl mb-4">参拝マナーについて</p>

      <button className="bg-indigo-600 px-4 py-2 rounded" onClick={handlePostWish}>
        参拝マナーを見る
      </button>
    </section>
  );
};

export default SandoSection;
