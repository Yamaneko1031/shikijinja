import { jsonResponse } from '@/server/response';
import { prisma } from '@/server/prisma';
import { getSessionUser } from '@/server/userSession';
import { OmikujiDetail, OmikujiResponse } from '@/types/omikuji';

export async function POST(request: Request) {
  try {
    const { user } = await getSessionUser();
    if (!user) return jsonResponse({ error: 'ユーザー情報が見つかりません' }, { status: 404 });

    const { details, fortune, msg, job, type, period, fortuneNumber } = (await request.json()) as {
      details: OmikujiDetail[];
      fortune: string;
      msg: string;
      job: string;
      type: string;
      period: string;
      fortuneNumber: number;
    };

    const omikujiResult = await prisma.omikujiResult.create({
      data: {
        userId: user.id,
        job,
        type,
        period,
        fortuneNumber,
        fortune,
        msg,
        details,
      },
    });

    const omikujiResponse: OmikujiResponse = {
      id: omikujiResult.id,
      job: omikujiResult.job,
      type: omikujiResult.type,
      period: omikujiResult.period,
      fortuneNumber: omikujiResult.fortuneNumber,
      fortune: omikujiResult.fortune,
      msg: omikujiResult.msg,
      details: omikujiResult.details as OmikujiDetail[],
      createdAt: omikujiResult.createdAt.toISOString(),
    };

    return jsonResponse(omikujiResponse, { status: 200 });
  } catch (err) {
    console.error('POST /api/omikuji error', err);
    return jsonResponse({ error: 'おみくじ保存に失敗しました' }, { status: 500 });
  }
}
