import { jsonResponse } from '@/server/response';
import { prisma } from '@/server/prisma';
import { getSessionUser } from '@/server/userSession';
import { openaiTemplateRequest } from '@/server/openaiTemplateRequest';
import { OmamoriCommentUserPrompt, OmamoriDataResponse } from '@/types/omamori';
import { Fortune } from '@/types/user';
export async function POST(request: Request) {
  try {
    const { user } = await getSessionUser();
    if (!user) return jsonResponse({ error: 'ユーザー情報が見つかりません' }, { status: 404 });

    const { omamoriId } = (await request.json()) as {
      omamoriId: string;
    };

    const setOmamori = await prisma.omamori.findUnique({
      where: {
        id: omamoriId,
      },
      include: {
        base: true,
      },
    });

    if (!setOmamori) return jsonResponse({ error: 'お守りが見つかりません' }, { status: 404 });

    const userPrompt: OmamoriCommentUserPrompt = {
      name: setOmamori.base.name,
      description: setOmamori.base.description,
      fortunes: setOmamori.fortunes as Fortune[],
    };
    const res = await openaiTemplateRequest('omamori_comment', JSON.stringify(userPrompt));
    if (!res) return jsonResponse({ error: 'おまもりコメント生成に失敗しました' }, { status: 500 });
    setOmamori.additionalDescription = res;

    const updatedOmamori = await prisma.omamori.update({
      where: {
        id: omamoriId,
      },
      data: {
        additionalDescription: setOmamori.additionalDescription,
      },
      include: {
        base: true,
      },
    });

    const omamoriDataResponse: OmamoriDataResponse = {
      name: updatedOmamori.base.name,
      hurigana: updatedOmamori.base.hurigana,
      description: updatedOmamori.base.description,
      imageUrl: updatedOmamori.base.imageUrl,
      price: updatedOmamori.base.price,
      id: updatedOmamori.id,
      baseId: updatedOmamori.baseId,
      additionalDescription: updatedOmamori.additionalDescription,
      fortunes: updatedOmamori.fortunes as Fortune[],
      createdAt: updatedOmamori.createdAt.toISOString(),
    };

    return jsonResponse(omamoriDataResponse, { status: 200 });
  } catch (err) {
    console.error('POST /api/omamori/comment error', err);
    return jsonResponse({ error: 'お守りコメント生成に失敗しました' + err }, { status: 500 });
  }
}
