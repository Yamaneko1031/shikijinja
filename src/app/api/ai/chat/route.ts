import { openai } from '@/server/openai';
import { gemini } from '@/server/gemini';
import { jsonResponse } from '@/server/response';

export async function POST(request: Request) {
  const { model, systemPrompt, userPrompt, instructions, temperature } = (await request.json()) as {
    model: string;
    systemPrompt: string;
    userPrompt: string;
    instructions?: string;
    temperature: number;
  };

  // 必要なら入力チェックを入れる
  if (!model || !systemPrompt || !userPrompt) {
    return jsonResponse({ error: 'model, systemPrompt, userPrompt は必須です' }, { status: 400 });
  }

  if (model.includes('gemini')) {
    const message = instructions
      ? `${systemPrompt}\n\n【追加指示】\n${instructions}`
      : systemPrompt;

    const fullMessage = message + userPrompt;

    try {
      const response = await gemini.models.generateContent({
        model,
        contents: fullMessage,
        config: {
          responseMimeType: 'application/json',
        },
      });
      const reply = response.text ?? '';
      return jsonResponse({ reply });
    } catch (err: unknown) {
      console.error('POST /api/ai/chat error', err);
      return jsonResponse({ error: 'AI 生成に失敗しました' }, { status: 500 });
    }
  } else {
    const fullSystem = instructions
      ? `${systemPrompt}\n\n【追加指示】\n${instructions}`
      : systemPrompt;

    try {
      // OpenAI に投げる
      const resp = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: fullSystem },
          { role: 'user', content: userPrompt },
        ],
        temperature,
      });

      const reply = resp.choices?.[0]?.message?.content ?? '';

      return jsonResponse({ reply });
    } catch (err: unknown) {
      console.error('POST /api/ai/chat error', err);
      return jsonResponse({ error: 'AI 生成に失敗しました' }, { status: 500 });
    }
  }
}
