import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
  }
  return openaiClient;
}

export async function generateWithAI(
  systemPrompt: string,
  userPrompt: string,
  jsonMode: boolean = true
): Promise<string> {
  const openai = getOpenAI();

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: jsonMode ? { type: 'json_object' } : undefined,
    temperature: 0.7,
    max_tokens: 4000,
  });

  return response.choices[0]?.message?.content || '';
}
