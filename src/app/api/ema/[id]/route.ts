// app/api/ema/[id]/route.ts
import { prisma } from '@/server/prisma';
import { jsonResponse } from '@/server/response';
import type { PatchEmaBody } from '@/types/ema';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  try {
    // リクエストボディから更新フィールドだけを受け取る
    const { decision, reasons } = (await request.json()) as PatchEmaBody;

    // 更新データを動的に組み立て
    const data: Record<string, string | string[]> = {};
    if (decision !== undefined) data.decision = decision;
    if (reasons !== undefined) data.reasons = reasons;

    // Prisma で更新
    const updated = await prisma.emaPost.update({
      where: { id },
      data,
    });

    return jsonResponse(updated);
  } catch (err) {
    console.error(`PATCH /api/ema/${id} error`, err);
    return jsonResponse({ error: '絵馬の更新に失敗しました' }, { status: 500 });
  }
}
