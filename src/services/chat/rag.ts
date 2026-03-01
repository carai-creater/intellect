import "server-only";
import { getGeminiClient } from "@/lib/gemini";
import type { ChatResponse } from "@/types";

/**
 * RAG: コンテキスト（PDF全文）をシステムプロンプトに注入して Gemini で回答生成。
 * MVP は「全文をコンテキストに入れる」シンプル実装。
 */
export async function generateReply(params: {
  userMessage: string;
  contextText: string | null;
  creatorName?: string;
  promoLink?: string | null;
}): Promise<ChatResponse> {
  const { userMessage, contextText, creatorName, promoLink } = params;
  const genai = getGeminiClient();

  const systemInstruction =
    contextText && contextText.trim().length > 0
      ? `あなたは、以下の「参考資料」に基づいて質問に答えるアシスタントです。参考資料にない内容には推測で答えるのではなく「資料に記載がありません」と伝えてください。\n\n## 参考資料\n\n${contextText}`
      : "あなたは親切なアシスタントです。質問に簡潔に答えてください。";

  let res;
  try {
    res = await genai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: userMessage,
      config: {
        systemInstruction,
        temperature: 0.3,
        maxOutputTokens: 2048,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`Gemini API error: ${msg}`);
  }

  const text =
    (res && typeof (res as { text?: string }).text === "string" ? (res as { text: string }).text.trim() : "") ||
    (() => {
      const part = res?.candidates?.[0]?.content?.parts?.[0];
      return part && typeof part === "object" && "text" in part ? String((part as { text: unknown }).text).trim() : "";
    })();

  const result: ChatResponse = {
    content: text || "申し訳ありません。回答を生成できませんでした。",
  };

  if (creatorName) {
    result.supportedBy = { creatorName, promoLink: promoLink ?? null };
  }

  return result;
}
