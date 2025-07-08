import { openaiTemplateRequest } from '@/server/openaiTemplateRequest';
import { prisma } from '@/server/prisma';
import { jsonResponse } from '@/server/response';
import { getSessionUser } from '@/server/userSession';

export async function PATCH(request: Request) {
  try {
    const { user } = await getSessionUser();
    if (!user) return jsonResponse({ error: 'ユーザー情報が見つかりません' }, { status: 404 });

    const { name } = (await request.json()) as {
      name: string;
    };

    const checkResult = await openaiTemplateRequest('post_check', name);
    if (!checkResult) {
      return jsonResponse({ error: 'チェック用テンプレートの実行に失敗しました' }, { status: 500 });
    }

    const checkResultJson = JSON.parse(checkResult);
    const decision = checkResultJson.decision;
    const reasons = checkResultJson.reasons;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name, decision, reasons },
    });

    return jsonResponse({ name: updatedUser.name }, { status: 200 });
  } catch (err) {
    console.error('POST /api/user/rename error', err);
    return jsonResponse({ error: 'ユーザー名変更に失敗しました' + err }, { status: 500 });
  }
}
