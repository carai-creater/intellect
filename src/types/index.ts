/**
 * 共通型定義（Expo/API と共有しやすいよう分離）
 */

export interface Creator {
  id: string;
  name: string;
  promoLink: string | null;
  createdAt: string;
}

export interface ContextDocument {
  id: string;
  creatorId: string;
  storagePath: string;
  fileName: string;
  /** テキスト化済み本文（RAG用） */
  extractedText: string | null;
  createdAt: string;
}

/** アップロード時に作成する「AI先生」1件 */
export interface Teacher {
  id: string;
  name: string;
  creatorName: string | null;
  promoLink: string | null;
  storagePath: string;
  fileName: string;
  extractedText: string | null;
  createdAt: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  contextId?: string;
  /** 選択するAIプロバイダ（省略時は Gemini） */
  model?: "gemini" | "openai";
  history?: ChatMessage[];
}

export interface ChatResponse {
  content: string;
  supportedBy?: {
    creatorName: string;
    promoLink: string | null;
  };
}
