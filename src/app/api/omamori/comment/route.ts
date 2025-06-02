import { json } from '@/server/response';
import { prisma } from '@/server/prisma';
import { getSessionUser } from '@/server/userSession';
import { openaiTemplateRequest } from '@/server/openaiTemplateRequest';
import { OmamoriCommentUserPrompt, OmamoriData } from '@/types/omamori';
export async function POST(request: Request) {
  try {
    const { user } = await getSessionUser();
    if (!user) return json({ error: 'ユーザー情報が見つかりません' }, { status: 404 });

    const { setOmamori } = (await request.json()) as {
      setOmamori: OmamoriData;
    };

    if (!setOmamori) return json({ error: 'お守りが見つかりません' }, { status: 404 });

    const userPrompt: OmamoriCommentUserPrompt = {
      name: setOmamori.name,
      description: setOmamori.description,
      effects: setOmamori.effects,
    };
    const res = await openaiTemplateRequest('omamori_comment', JSON.stringify(userPrompt));
    if (!res) return json({ error: 'おまもりコメント生成に失敗しました' }, { status: 500 });
    setOmamori.additionalDescription = res;

    await prisma.omamori.create({
      data: {
        userId: user.id,
        name: setOmamori.name,
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
