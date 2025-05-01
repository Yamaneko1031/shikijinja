// app/api/ai/prompt-templates/route.ts
import { prisma } from '@/server/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { json } from '@/server/response';

export async function GET() {
  try {
    const templates = await prisma.promptTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return json({ templates }, { status: 200 });
  } catch (err) {
    console.error('GET /api/ai/prompt-templates error', err);
    return json({ error: 'テンプレート一覧の取得に失敗しました' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { label, systemPrompt, userPrompt, model, instructions, temperature } =
      (await request.json()) as {
        label?: string;
        systemPrompt?: string;
        userPrompt?: string;
        model?: string;
        instructions?: string;
        temperature?: number;
      };
    if (!label || !systemPrompt || !userPrompt || !model) {
      return json({ error: 'label, systemPrompt, userPrompt, model は必須です' }, { status: 400 });
    }
    try {
      const created = await prisma.promptTemplate.create({
        data: {
          label,
          systemPrompt,
          userPrompt,
          model,
          instructions: instructions ?? '',
          temperature: temperature ?? 0.7,
        },
      });
      return json(created, { status: 201 });
    } catch (e: unknown) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        return json({ error: 'label が重複しています' }, { status: 409 });
      }
      throw e;
    }
  } catch (err) {
    console.error('POST /api/ai/prompt-templates error', err);
    return json({ error: 'テンプレートの作成に失敗しました' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, label, systemPrompt, userPrompt, model, instructions, temperature } =
      (await request.json()) as {
        id?: string;
        label?: string;
        systemPrompt?: string;
        userPrompt?: string;
        model?: string;
        instructions?: string;
        temperature?: number;
      };
    if (!id || !label || !systemPrompt || !userPrompt || !model) {
      return json(
        { error: 'id, label, systemPrompt, userPrompt, model は必須です' },
        { status: 400 }
      );
    }
    try {
      const updated = await prisma.promptTemplate.update({
        where: { id },
        data: {
          label,
          systemPrompt,
          userPrompt,
          model,
          instructions: instructions ?? '',
          temperature: temperature ?? 0.7,
        },
      });
      return json(updated, { status: 200 });
    } catch (e: unknown) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        return json({ error: 'label が重複しています' }, { status: 409 });
      }
      throw e;
    }
  } catch (err) {
    console.error('PUT /api/ai/prompt-templates error', err);
    return json({ error: 'テンプレートの更新に失敗しました' }, { status: 500 });
  }
}
