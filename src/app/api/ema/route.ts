import OpenAI from 'openai';
import { prisma } from '@/server/prisma';
import { EmaPost } from '@/types/ema';
import { json } from '@/server/response';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    // 絵馬一覧（返信つき）
    const posts = await prisma.emaPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
    return json(posts);
  } catch (err) {
    console.error('GET /api/ema error', err);
    return json({ error: '絵馬一覧の取得に失敗しました' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // クライアントから texts と絵馬画像キーを受け取る
    const { texts, emaImage } = (await request.json()) as EmaPost;
    let templateLabel = '';

    switch (emaImage) {
      case 'shikineko':
        templateLabel = 'ema_rep_shikineko';
        break;
      case 'iroha':
        templateLabel = 'ema_rep_iroha';
        break;
      case 'tenten':
        templateLabel = 'ema_rep_tenten';
        break;
      case 'nadeneko':
        templateLabel = 'ema_rep_nadeneko';
        break;
      default:
        console.error('emaImage not found', emaImage);
        templateLabel = 'ema_rep_shikineko';
    }

    // プロンプトテンプレートを取得
    const tpl = await prisma.promptTemplate.findFirst({
      where: { label: templateLabel },
    });
    if (!tpl) {
      return json({ error: '返信用テンプレートが見つかりません' }, { status: 404 });
    }

    // system/user プロンプトを組み立て
    const wish = texts[0]?.text ?? '';
    const system = tpl.systemPrompt;
    const user = tpl.userPrompt + wish;

    // OpenAI で返信を生成
    const resp = await openai.chat.completions.create({
      model: tpl.model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: tpl.temperature,
    });
    const newReply = resp.choices?.[0]?.message?.content?.trim() ?? '';

    // EmaPost テーブルに texts, reply, emaImage をまとめて保存
    const post = await prisma.emaPost.create({
      data: {
        texts: texts, // Prisma の Json フィールドに自動シリアライズ
        reply: newReply,
        emaImage: emaImage,
      },
    });

    // クライアントへ新規レコードを返却
    return json(post, { status: 201 });
  } catch (err) {
    console.error('POST /api/ema error', err);
    return json({ error: '絵馬投稿または返信生成に失敗しました' }, { status: 500 });
  }
}
