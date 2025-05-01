import { prisma } from '@/server/prisma';
import { EmaPost } from '@/types/ema';
import { json } from '@/server/response';
import { openaiTemplateRequest } from '@/server/openaiTemplateRequest';

export async function GET(request: Request) {
  try {
    // クエリーパラメータでdecisionを取得
    const url = new URL(request.url);
    const decisionParam = url.searchParams.get('decision') || 'ALLOW';

    // 絵馬一覧（返信つき）
    const posts = await prisma.emaPost.findMany({
      where: { decision: decisionParam },
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

    const checkText = texts[0]?.text + texts[1]?.text;
    const checkResult = await openaiTemplateRequest('ema_check', checkText);

    if (!checkResult) {
      return json({ error: 'チェック用テンプレートの実行に失敗しました' }, { status: 500 });
    }

    const checkResultJson = JSON.parse(checkResult);
    const decision = checkResultJson.decision;
    const reasons = checkResultJson.reasons;

    const newReply = await openaiTemplateRequest(templateLabel, texts[0]?.text ?? '');

    if (!newReply) {
      return json({ error: 'チェック用テンプレートの実行に失敗しました' }, { status: 500 });
    }

    // EmaPost テーブルに texts, reply, emaImage をまとめて保存
    const post = await prisma.emaPost.create({
      data: {
        texts: texts, // Prisma の Json フィールドに自動シリアライズ
        reply: newReply,
        decision: decision,
        reasons: reasons,
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
