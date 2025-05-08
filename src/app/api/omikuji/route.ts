import { json } from '@/server/response';
import { openaiTemplateRequest } from '@/server/openaiTemplateRequest';
import { prisma } from '@/server/prisma';

export async function POST(request: Request) {
  try {
    const { type, period } = (await request.json()) as {
      type: string;
      period: string;
    };

    let templateLabel = '';

    switch (type) {
      case 'shikineko':
        templateLabel = 'omikuji_shikineko';
        break;
      case 'iroha':
        templateLabel = 'omikuji_iroha';
        break;
      case 'tenten':
        templateLabel = 'omikuji_tenten';
        break;
      case 'nadeneko':
        templateLabel = 'omikuji_nadeneko';
        break;
      default:
        console.error('type not found', type);
        templateLabel = 'omikuji_shikineko';
    }

    const result = await openaiTemplateRequest(templateLabel, period);

    if (!result) {
      return json({ error: 'テンプレートの実行に失敗しました' }, { status: 500 });
    }

    const resultJson = JSON.parse(result);

    // OmikujiResult テーブルに texts, reply, emaImage をまとめて保存
    const omikujiResult = await prisma.omikujiResult.create({
      data: {
        type: type,
        period: period,
        fortune: resultJson.fortune,
        msg: resultJson.msg,
        details: resultJson.details,
      },
    });

    // クライアントへ新規レコードを返却
    return json(omikujiResult, { status: 201 });
    // return json(resultJson, { status: 200 });
  } catch (err) {
    console.error('POST /api/omikuji error', err);
    return json({ error: 'おみくじ生成に失敗しました' }, { status: 500 });
  }
}
