import { json } from '@/server/response';
import { openaiTemplateRequest } from '@/server/openaiTemplateRequest';
import { prisma } from '@/server/prisma';
import { OmikujiResponse } from '@/types/omikuji';
import { getSessionUser } from '@/server/userSession';
export async function POST(request: Request) {
  try {
    const { user } = await getSessionUser();
    if (!user) return json({ error: 'ユーザー情報が見つかりません' }, { status: 404 });

    const { job, fortuneNumber, period } = (await request.json()) as {
      job: string;
      fortuneNumber: number;
      period: string;
    };

    const userPrompt = `\n職業：${job}\n運勢：${fortuneNumber}\n対象期間：${period}`;
    const res = await openaiTemplateRequest('omikuji_free', userPrompt);

    if (!res) return json({ error: 'おみくじ生成に失敗しました' }, { status: 500 });
    const { fortune, msg, details } = JSON.parse(res);
    const result = await prisma.omikujiResult.create({
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

    const omikujiResponse: OmikujiResponse = {
      id: result.id,
      job,
      period,
      fortuneNumber,
      fortune,
      msg,
      details,
      createdAt: result.createdAt.toISOString(),
    };

    return json(omikujiResponse, { status: 200 });
  } catch (err) {
    console.error('POST /api/omikuji error', err);
    return json({ error: 'おみくじ生成に失敗しました' + err }, { status: 500 });
  }
}
