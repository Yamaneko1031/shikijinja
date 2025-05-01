import { openai } from '@/server/openai';
import { json } from '@/server/response';

export async function GET() {
  try {
    // v4 SDK なら resp.data がモデル配列
    const resp = await openai.models.list();
    const models = resp.data.map((m) => m.id);
    return json({ models });
  } catch (err) {
    console.error('listModels error', err);
    return json({ error: 'モデル一覧の取得に失敗しました' }, { status: 500 });
  }
}
