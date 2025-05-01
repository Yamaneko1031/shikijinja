// app/api/ai/chat/route.ts
import { OpenAI } from 'openai';
import { json } from '@/server/response';

// 自前で定義
type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { model, systemPrompt, userPrompt, instructions, temperature } =
      (await request.json()) as {
        model: string;
        systemPrompt: string;
        userPrompt: string;
        instructions?: string;
        temperature?: number;
      };

    // 必要なら入力チェックを入れる
    if (!model || !systemPrompt || !userPrompt) {
      return json({ error: 'model, systemPrompt, userPrompt は必須です' }, { status: 400 });
    }
    const fullSystem = instructions
      ? `${systemPrompt}\n\n【追加指示】\n${instructions}`
      : systemPrompt;

    const messages: ChatMessage[] = [
      { role: 'system', content: fullSystem },
      { role: 'user', content: userPrompt },
    ];

    // OpenAI に投げる
    const resp = await openai.chat.completions.create({
      model,
      messages,
      temperature: temperature ?? 0.7,
    });

    const reply = resp.choices?.[0]?.message?.content ?? '';

    return json({ reply });
  } catch (err: unknown) {
    console.error('POST /api/ai/chat error', err);
    return json({ error: 'AI 生成に失敗しました' }, { status: 500 });
  }
}
