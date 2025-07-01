// app/api/ema/[id]/route.ts
import { prisma } from '@/server/prisma';
import { jsonResponse } from '@/server/response';
import { OmamoriDataResponse } from '@/types/omamori';
import { Fortune } from '@/types/user';
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    // Prisma で更新
    const result = await prisma.omamori.findUnique({
      where: { id },
    });
    const allBases = await prisma.omamoriBase.findMany();

    if (!result) {
      return jsonResponse({ error: 'お守りの結果が見つかりません' }, { status: 404 });
    }

    const omamoriBase = allBases.find((base) => base.id === result.baseId);
    if (!omamoriBase) {
      return jsonResponse({ error: 'お守りのマスタが見つかりません' }, { status: 404 });
    }

    const omamoriResponse: OmamoriDataResponse = {
      id: result.id,
      baseId: result.baseId,
      name: omamoriBase.name,
      hurigana: omamoriBase.hurigana,
      description: omamoriBase.description,
      imageUrl: omamoriBase.imageUrl,
      price: omamoriBase.price,
      fortunes: result.fortunes as Fortune[],
      additionalDescription: result.additionalDescription,
      createdAt: result.createdAt.toISOString(),
    };

    return jsonResponse(omamoriResponse, { status: 200 });
  } catch (err) {
    console.error(`GET /api/omamori/${id} error`, err);
    return jsonResponse({ error: 'お守りの結果取得に失敗しました' }, { status: 500 });
  }
}
