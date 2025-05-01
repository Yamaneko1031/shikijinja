// app/api/ema/[id]/route.ts
import { prisma } from '@/server/prisma';
import { json } from '@/server/response';
import type { EmaPostResponse, TextBlock, EmaImageKey, PatchEmaBody } from '@/types/ema';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // リクエストボディから更新フィールドだけを受け取る
    const { decision, reasons } = (await request.json()) as PatchEmaBody;

    // 更新データを動的に組み立て
    const data: Record<string, 'ALLOW' | 'BLOCK' | 'UNCHECKED' | string[]> = {};
    if (decision !== undefined) data.decision = decision;
    if (reasons !== undefined) data.reasons = reasons;

    // Prisma で更新
    const updated = await prisma.emaPost.update({
      where: { id },
      data,
    });

    // EmaPostResponse 型で返却
    return json<EmaPostResponse>({
      ...updated,
      texts: updated.texts as TextBlock[],
      reasons: updated.reasons as string[],
      emaImage: updated.emaImage as EmaImageKey,
      createdAt: updated.createdAt.toISOString(),
    });
  } catch (err) {
    console.error(`PATCH /api/ema/${id} error`, err);
    return json({ error: '絵馬の更新に失敗しました' }, { status: 500 });
  }
}
