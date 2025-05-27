import { json } from '@/server/response';
import { prisma } from '@/server/prisma';
import { getSessionUser } from '@/server/userSession';
import { OmikujiDetail } from '@/types/omikuji';

export async function POST(request: Request) {
  try {
    const { user } = await getSessionUser();
    if (!user) return json({ error: 'ユーザー情報が見つかりません' }, { status: 404 });

    const { details, fortune, msg, job, period, fortuneNumber } = (await request.json()) as {
      details: OmikujiDetail[];
      fortune: string;
      msg: string;
      job: string;
      period: string;
      fortuneNumber: number;
    };

    await prisma.omikujiResult.create({
      data: {
        userId: user.id,
        job,
        period,
        fortuneNumber,
        fortune,
        msg,
        details,
      },
    });

    return json({ result: 'OK' }, { status: 200 });
  } catch (err) {
    console.error('POST /api/omikuji error', err);
    return json({ error: 'おみくじ保存に失敗しました' }, { status: 500 });
  }
}
