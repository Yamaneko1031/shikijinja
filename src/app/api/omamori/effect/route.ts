import { json } from '@/server/response';
import { getSessionUser } from '@/server/userSession';
import { baseOmamoriList, effectNames } from '@/config/omamori';

export async function POST() {
  try {
    const { user } = await getSessionUser();
    if (!user) return json({ error: 'ユーザー情報が見つかりません' }, { status: 404 });

    // baseOmamoriListからランダムで一つ選ぶ
    const setOmamori = baseOmamoriList[Math.floor(Math.random() * baseOmamoriList.length)];

    setOmamori.effects.map((effect) => {
      effect.power += Math.floor(Math.random() * (100 - effect.power)) + 1;
    });

    // 3~6個のエフェクトを追加
    const effectCount = Math.floor(Math.random() * 4) + 3;
    for (let i = 0; i < effectCount; i++) {
      const randomEffect = effectNames[Math.floor(Math.random() * effectNames.length)];
      // すでに同じeffect.nameがある場合はpowerを加算、なければ新規追加
      const existingEffect = setOmamori.effects.find((effect) => effect.name === randomEffect);
      const addPower = Math.floor(Math.random() * 100) + 1;
      if (existingEffect) {
        i--;
      } else {
        setOmamori.effects.push({
          name: randomEffect,
          power: addPower,
        });
      }
    }

    return json(setOmamori, { status: 200 });
  } catch (err) {
    console.error('POST /api/omikuji error', err);
    return json({ error: 'お守り購入に失敗しました' + err }, { status: 500 });
  }
}
