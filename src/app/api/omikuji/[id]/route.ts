// app/api/ema/[id]/route.ts
import { prisma } from '@/server/prisma';
import { jsonResponse } from '@/server/response';
import { OmikujiResponse, OmikujiDetail } from '@/types/omikuji';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    // Prisma で更新
    const result = await prisma.omikujiResult.findUnique({
      where: { id },
    });

    if (!result) {
      return jsonResponse({ error: 'おみくじの結果が見つかりません' }, { status: 404 });
    }

    const omikujiResponse: OmikujiResponse = {
      id: result.id,
      job: result.job,
      type: result.type,
      period: result.period,
      fortuneNumber: result.fortuneNumber,
      fortune: result.fortune,
      msg: result.msg,
      details: result.details as OmikujiDetail[],
      createdAt: result.createdAt.toISOString(),
    };

    return jsonResponse(omikujiResponse, { status: 200 });
  } catch (err) {
    console.error(`GET /api/omikuji/${id} error`, err);
    return jsonResponse({ error: 'おみくじの結果取得に失敗しました' }, { status: 500 });
  }
}
