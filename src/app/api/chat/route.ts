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
    const { message, contextId, history } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error: "チャットの設定がありません。",
          hint: ".env.local に GEMINI_API_KEY を設定してください。Google AI Studio で API キーを発行できます。",
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

    const response = await generateReply({
      userMessage: message,
      contextText,
      creatorName,
      promoLink,
    });

    return NextResponse.json(response);
  } catch (err) {
    console.error("[POST /api/chat]", err);
    const message = err instanceof Error ? err.message : "";
    const isKeyError = /API key|GEMINI|invalid|quota/i.test(message);
    return NextResponse.json(
      {
        error: isKeyError
          ? "Gemini API の設定を確認してください。"
          : "回答の生成に失敗しました。",
        hint: isKeyError
          ? ".env.local の GEMINI_API_KEY が正しいか、Google AI Studio でキーが有効か確認してください。"
          : "しばらくしてからもう一度お試しください。",
      },
      { status: isKeyError ? 503 : 500 }
    );
  }
}
