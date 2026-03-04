import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateReply } from "@/services/chat";
import type { ChatRequest } from "@/types";

/**
 * POST /api/chat
 * 利用者モード: メッセージを送り、RAG + Gemini で回答を得る。
 * 作成者情報があれば「Supported by [作成者名]」を付与。
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequest;
    const { message, contextId, history, model } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 }
      );
    }

    // デフォルトは Gemini
    const provider = model === "openai" ? "openai" : "gemini";

    if (provider === "gemini" && !process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error: "Gemini API キーが設定されていません。",
          hint: process.env.VERCEL
            ? "Vercel の Project Settings → Environment Variables に GEMINI_API_KEY を追加して Redeploy してください。"
            : "ローカル: .env.local に GEMINI_API_KEY を設定してください。Google AI Studio で API キーを発行できます。",
        },
        { status: 503 }
      );
    }

    if (provider === "openai" && !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "OpenAI API キーが設定されていません。",
          hint: process.env.VERCEL
            ? "Vercel の Project Settings → Environment Variables に OPENAI_API_KEY を追加して Redeploy してください。"
            : "ローカル: .env.local に OPENAI_API_KEY を設定してください。",
        },
        { status: 503 }
      );
    }

    let contextText: string | null = null;
    let creatorName: string | undefined = undefined;
    let promoLink: string | null = null;

    if (contextId && typeof contextId === "string") {
      const supabase = await createClient();
      const { data: teacher, error } = await supabase
        .from("teachers")
        .select("extracted_text, creator_name, promo_link")
        .eq("id", contextId)
        .single();
      if (!error && teacher) {
        contextText = teacher.extracted_text ?? null;
        creatorName = teacher.creator_name ?? undefined;
        promoLink = teacher.promo_link ?? null;
      }
    }

    let response;
    if (provider === "openai") {
      // lazy import to avoid bundling on client
      const { generateReplyOpenAI } = await import("@/services/chat/openai");
      response = await generateReplyOpenAI({
        userMessage: message,
        contextText,
        creatorName,
        promoLink,
      });
    } else {
      response = await generateReply({
        userMessage: message,
        contextText,
        creatorName,
        promoLink,
      });
    }

    return NextResponse.json(response);
  } catch (err) {
    console.error("[POST /api/chat]", err);
    const message = err instanceof Error ? err.message : "";
    const isApiKeyError = /API key|GEMINI|OPENAI|invalid|quota/i.test(message);
    return NextResponse.json(
      {
        error: isApiKeyError
          ? "AI API の設定を確認してください。"
          : "回答の生成に失敗しました。",
        hint: isApiKeyError
          ? process.env.VERCEL
            ? "Vercel の Environment Variables でキーが正しく設定されているか確認し、Redeploy してください。"
            : "`.env.local` の GEMINI_API_KEY または OPENAI_API_KEY を確認してください。"
          : "しばらくしてからもう一度お試しください。",
      },
      { status: isApiKeyError ? 503 : 500 }
    );
  }
}
