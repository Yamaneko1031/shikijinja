import { json } from '@/server/response';
// import { openaiTemplateRequest } from '@/server/openaiTemplateRequest';
import { prisma } from '@/server/prisma';
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
      setOmamori.effects.push({
        name: randomEffect,
        power: Math.floor(Math.random() * 10) + 1,
      });
    }

    await prisma.omamori.create({
      data: {
        userId: user.id,
        name: omamoriName,
        description: setOmamori.description,
        additionalDescription: setOmamori.additionalDescription,
        imageUrl: setOmamori.imageUrl,
        price: setOmamori.price,
        effects: setOmamori.effects,
      },
    });

    return json(setOmamori, { status: 200 });
  } catch (err) {
    console.error('POST /api/omikuji error', err);
    return json({ error: 'おみくじ生成に失敗しました' + err }, { status: 500 });
  }
}
