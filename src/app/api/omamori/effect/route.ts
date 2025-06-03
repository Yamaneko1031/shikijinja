import { json } from '@/server/response';
import { getSessionUser } from '@/server/userSession';
import { baseOmamoriList, effectNames } from '@/config/omamori';

export async function POST(request: Request) {
  try {
    const { user } = await getSessionUser();
    if (!user) return json({ error: 'ユーザー情報が見つかりません' }, { status: 404 });

    const { omamoriName } = (await request.json()) as {
      omamoriName: string;
    };

    const setOmamori = baseOmamoriList.find((omamori) => omamori.name === omamoriName);
    if (!setOmamori) return json({ error: 'お守りが見つかりません' }, { status: 404 });

    setOmamori.effects.map((effect) => {
      effect.power += Math.floor(Math.random() * 6);
    });

    for (let i = 0; i < 5; i++) {
      const randomEffect = effectNames[Math.floor(Math.random() * effectNames.length)];
      // すでに同じeffect.nameがある場合はpowerを加算、なければ新規追加
      const existingEffect = setOmamori.effects.find((effect) => effect.name === randomEffect);
      const addPower = Math.floor(Math.random() * 100) + 1;
      if (existingEffect) {
        existingEffect.power += addPower;
        if (existingEffect.power > 100) {
          existingEffect.power = 100;
        }
        i--;
        console.log('重複', existingEffect.name, existingEffect.power);
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
