import { jsonResponse } from '@/server/response';
import { getSessionUser } from '@/server/userSession';
import { fortuneNames } from '@/config/fortune';
import { OmamoriDataResponse } from '@/types/omamori';
import { prisma } from '@/server/prisma';
import { Fortune } from '@/types/user';

export async function POST() {
  try {
    const { user } = await getSessionUser();
    if (!user) return jsonResponse({ error: 'ユーザー情報が見つかりません' }, { status: 404 });

    // マスタからランダムで一つ選ぶ
    const allBases = await prisma.omamoriBase.findMany();
    const omamoriBase = allBases[Math.floor(Math.random() * allBases.length)];

    // 3~6個の運を追加
    const setFortunes = omamoriBase.fortunes as Fortune[];
    setFortunes.map((fortune) => {
      fortune.power += Math.floor(Math.random() * (100 - fortune.power)) + 1;
    });
    const effectCount = Math.floor(Math.random() * 4) + 3;
    for (let i = 0; i < effectCount; i++) {
      const randomEffect = fortuneNames[Math.floor(Math.random() * fortuneNames.length)];
      // すでに同じeffect.nameがある場合はpowerを加算、なければ新規追加
      const existingEffect = setFortunes.find((fortune) => fortune.name === randomEffect);
      const addPower = Math.floor(Math.random() * 100) + 1;
      if (existingEffect) {
        i--;
      } else {
        setFortunes.push({
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
        fortunes: setFortunes,
      },
    });

    const omamoriDataResponse: OmamoriDataResponse = {
      name: omamoriBase.name,
      hurigana: omamoriBase.hurigana,
      description: omamoriBase.description,
      imageUrl: omamoriBase.imageUrl,
      price: omamoriBase.price,
      id: omamoriData.id,
      baseId: omamoriData.baseId,
      additionalDescription: omamoriData.additionalDescription,
      fortunes: omamoriData.fortunes as Fortune[],
      createdAt: omamoriData.createdAt.toISOString(),
    };

    return jsonResponse(omamoriDataResponse, { status: 200 });
  } catch (err) {
    console.error('POST /api/omamori/effect error', err);
    return jsonResponse({ error: 'お守り効能取得に失敗しました' + err }, { status: 500 });
  }
}
