import { json } from '@/server/response';
import { openaiTemplateRequest } from '@/server/openaiTemplateRequest';
import { prisma } from '@/server/prisma';

export async function POST(request: Request) {
  try {
    const { fortuneNumber, period } = (await request.json()) as {
      fortuneNumber: number;
      period: string;
    };

    const user = `\n運勢：${fortuneNumber}\n対象期間：${period}`;
    const result = await openaiTemplateRequest('omikuji_neko', user);

    if (!result) {
      return json({ error: 'テンプレートの実行に失敗しました' }, { status: 500 });
    }

    const resultJson = JSON.parse(result);

    // OmikujiResult テーブルに texts, reply, emaImage をまとめて保存
    const omikujiResult = await prisma.omikujiResult.create({
      data: {
        type: '',
        period: period,
        fortune: resultJson.fortune,
        msg: resultJson.msg,
        details: resultJson.details,
      },
    });

    // クライアントへ新規レコードを返却
    return json(omikujiResult, { status: 201 });
  } catch (err) {
    console.error('POST /api/omikuji error', err);
    return json({ error: 'おみくじ生成に失敗しました' }, { status: 500 });
  }
}
