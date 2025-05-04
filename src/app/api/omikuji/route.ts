import { json } from '@/server/response';
import { openaiTemplateRequest } from '@/server/openaiTemplateRequest';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request) {
  try {
    const { templateKey, period } = (await request.json()) as {
      templateKey: string;
      period: string;
    };

    const result = await openaiTemplateRequest(templateKey, period);

    if (!result) {
      return json({ error: 'テンプレートの実行に失敗しました' }, { status: 500 });
    }
    return json(JSON.parse(result), { status: 200 });
  } catch (err) {
    console.error('POST /api/omikuji error', err);
    return json({ error: 'おみくじ生成に失敗しました' }, { status: 500 });
  }
}
