'use client';

const NadenekoSection = () => {
  const handlePostWish = () => {
    // 投稿ボタンの処理（例えば、APIに投稿する）
    alert(`撫でました`);
  };

  return (
    <section
      className="w-[300px] h-[400px] bg-black items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <h2 className="text-4xl font-bold mb-4">撫で猫</h2>
      <p className="text-xl mb-4">猫を撫でるコンテンツ</p>

      <button className="bg-indigo-600 px-4 py-2 rounded" onClick={handlePostWish}>
        撫でる
      </button>
    </section>
  );
};

export default NadenekoSection;
