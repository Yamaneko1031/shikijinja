import { jsonResponse } from '@/server/response';
import { getSessionUser } from '@/server/userSession';
import { effectNames } from '@/config/omamori';
import { OmamoriDataResponse } from '@/types/omamori';
import { OmamoriEffect } from '@/types/omamori';
import { prisma } from '@/server/prisma';
export async function POST() {
  try {
    const { user } = await getSessionUser();
    if (!user) return jsonResponse({ error: 'ユーザー情報が見つかりません' }, { status: 404 });

    // マスタからランダムで一つ選ぶ
    const allBases = await prisma.omamoriBase.findMany();
    const omamoriBase = allBases[Math.floor(Math.random() * allBases.length)];

    // 3~6個のエフェクトを追加
    const setEffects = omamoriBase.effects as OmamoriEffect[];
    setEffects.map((effect) => {
      effect.power += Math.floor(Math.random() * (100 - effect.power)) + 1;
    });
    const effectCount = Math.floor(Math.random() * 4) + 3;
    for (let i = 0; i < effectCount; i++) {
      const randomEffect = effectNames[Math.floor(Math.random() * effectNames.length)];
      // すでに同じeffect.nameがある場合はpowerを加算、なければ新規追加
      const existingEffect = setEffects.find((effect) => effect.name === randomEffect);
      const addPower = Math.floor(Math.random() * 100) + 1;
      if (existingEffect) {
        i--;
      } else {
        setEffects.push({
          name: randomEffect,
          power: addPower,
        });
      }
    }

    const omamoriData = await prisma.omamori.create({
      data: {
        userId: user.id,
        baseId: omamoriBase.id,
        additionalDescription: '',
        effects: setEffects,
      },
    });

    const omamoriDataResponse: OmamoriDataResponse = {
      name: omamoriBase.name,
      hurigana: omamoriBase.hurigana,
      description: omamoriBase.description,
      imageUrl: omamoriBase.imageUrl,
      price: omamoriBase.price,
      id: omamoriData.id,
      additionalDescription: omamoriData.additionalDescription,
      effects: omamoriData.effects as OmamoriEffect[],
      createdAt: omamoriData.createdAt.toISOString(),
    };

    return jsonResponse(omamoriDataResponse, { status: 200 });
  } catch (err) {
    console.error('POST /api/omikuji error', err);
    return jsonResponse({ error: 'お守り購入に失敗しました' + err }, { status: 500 });
  }
}
