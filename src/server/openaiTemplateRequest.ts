import { OpenAI } from 'openai';
import { prisma } from './prisma';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function openaiTemplateRequest(label: string, user: string): Promise<string | null> {
  // プロンプトテンプレートを取得
  const tpl = await prisma.promptTemplate.findFirst({
    where: { label: label },
  });
  if (!tpl) {
    return null;
  }

  const fullSystem = tpl.instructions
    ? `${tpl.systemPrompt}\n\n【追加指示】\n${tpl.instructions}`
    : tpl.systemPrompt;

  // OpenAI で返信を生成
  const resp = await openai.chat.completions.create({
    model: tpl.model,
    messages: [
      { role: 'system', content: fullSystem },
      { role: 'user', content: tpl.userPrompt + user },
    ],
    temperature: tpl.temperature,
  });
  return resp.choices?.[0]?.message?.content?.trim() ?? '';
}
