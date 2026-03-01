import "server-only";
import { GoogleGenAI } from "@google/genai";

/**
 * Gemini 1.5 Flash 用クライアント（サーバー側のみ使用）
 * API Key は NEXT_PUBLIC にしないこと
 */
export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  return new GoogleGenAI({ apiKey });
}
