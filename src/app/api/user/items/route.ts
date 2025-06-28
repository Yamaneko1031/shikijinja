import { jsonResponse } from '@/server/response';
import { prisma } from '@/server/prisma';
import { getSessionUser } from '@/server/userSession';
import { UserItems } from '@/types/user';
import { OmikujiResponse } from '@/types/omikuji';
import { OmamoriDataResponse } from '@/types/omamori';
import { EmaPostResponse } from '@/types/ema';

export async function GET() {
  try {
    const { user } = await getSessionUser();
    if (!user) return jsonResponse({ error: 'ユーザー情報が見つかりません' }, { status: 404 });

    const omikuji = await prisma.omikujiResult.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    const omamori = await prisma.omamori.findMany({
      where: { userId: user.id },
      include: {
        base: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const ema = await prisma.emaPost.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    const userItems: UserItems = {
      omikuji: omikuji.map((omikuji) => ({
        id: omikuji.id,
        job: omikuji.job,
        type: omikuji.type,
        period: omikuji.period,
        fortuneNumber: omikuji.fortuneNumber,
        fortune: omikuji.fortune,
        msg: omikuji.msg,
        details: omikuji.details,
        createdAt: omikuji.createdAt.toISOString(),
      })) as OmikujiResponse[],
      omamori: omamori.map((omamori) => ({
        name: omamori.base.name,
        hurigana: omamori.base.hurigana,
        description: omamori.base.description,
        imageUrl: omamori.base.imageUrl,
        price: omamori.base.price,
        fortunes: omamori.fortunes,
        id: omamori.id,
        baseId: omamori.baseId,
        additionalDescription: omamori.additionalDescription,
        createdAt: omamori.createdAt.toISOString(),
      })) as OmamoriDataResponse[],
      ema: ema.map((ema) => ({
        id: ema.id,
        texts: ema.texts,
        reply: ema.reply,
        decision: ema.decision,
        reasons: ema.reasons,
        emaImage: ema.emaImage,
        createdAt: ema.createdAt.toISOString(),
      })) as EmaPostResponse[],
    };

    return jsonResponse(userItems, { status: 200 });
  } catch (err) {
    console.error('POST /api/omikuji error', err);
    return jsonResponse({ error: 'おみくじ保存に失敗しました' }, { status: 500 });
  }
}
