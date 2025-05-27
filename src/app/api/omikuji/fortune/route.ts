import { json } from '@/server/response';
import { omikujiConfig } from '@/config/omikuji';

export async function POST(request: Request) {
  try {
    const { omikujiType } = (await request.json()) as {
      omikujiType: string;
    };

    const fortuneTable = omikujiConfig[omikujiType as keyof typeof omikujiConfig].fortune;
    const fortuneNumber = Math.floor(Math.random() * 100);

    let totalCount = 0;
    const fortune =
      fortuneTable.findIndex((item) => {
        totalCount += item;
        if (fortuneNumber < totalCount) {
          return true;
        }
      }) + 1;

    return json({ fortune, showType: 0 }, { status: 200 });
  } catch (err) {
    console.error('POST /api/omikuji error', err);
    return json({ error: 'おみくじ生成に失敗しました' }, { status: 500 });
  }
}
