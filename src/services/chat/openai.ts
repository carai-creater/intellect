import "server-only";
import type { ChatResponse } from "@/types";
import OpenAI from "openai";

/**
 * OpenAI API を使って RAG 返信を生成する。（Gemini 実装と同等の呼び出し）
 */
export async function generateReplyOpenAI(params: {
  userMessage: string;
  contextText: string | null;
  creatorName?: string;
  promoLink?: string | null;
}): Promise<ChatResponse> {
  const { userMessage, contextText, creatorName, promoLink } = params;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const client = new OpenAI({ apiKey });

  const systemInstruction =
    contextText && contextText.trim().length > 0
      ? `あなたは、以下の「参考資料」に基づいて質問に答えるアシスタントです。参考資料にない内容には推測で答えるのではなく「資料に記載がありません」と伝えてください。\n\n## 参考資料\n\n${contextText}`
      : "あなたは親切なアシスタントです。質問に簡潔に答えてください。";

  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: userMessage },
    ],
    temperature: 0.3,
    max_tokens: 2048,
  });

  const text =
    response.choices?.[0]?.message?.content?.trim() ||
    "申し訳ありません。回答を生成できませんでした。";

  const result: ChatResponse = {
    content: text,
  };

  if (creatorName) {
    result.supportedBy = { creatorName, promoLink: promoLink ?? null };
  }

  return result;
}
