import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** RAG用: PDF からテキストを抽出（最大文字数で打ち切り） */
const MAX_EXTRACTED_LENGTH = 500_000;

async function extractTextFromPdf(file: File): Promise<string | null> {
  try {
    const mod = await import("pdf-parse");
    const pdfParse = (mod.default ?? mod) as (buf: Buffer) => Promise<{ text?: string }>;
    const ab = await file.arrayBuffer();
    const buffer = Buffer.from(ab);
    const data = await pdfParse(buffer);
    const text =
      typeof data?.text === "string" ? data.text.trim() : "";
    if (!text) return null;
    return text.length > MAX_EXTRACTED_LENGTH
      ? text.slice(0, MAX_EXTRACTED_LENGTH) + "\n\n[一部省略しました]"
      : text;
  } catch (e) {
    console.error("[POST /api/upload] PDF extract error:", e);
    return null;
  }
}

/**
 * POST /api/upload
 * 作成者モード: PDF を Supabase Storage に保存し、テキストを抽出して DB に登録する。
 * extracted_text が RAG（チャット）で参照されます。
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const name = (formData.get("name") as string)?.trim() || "";
    const promoLink = (formData.get("promoLink") as string) || null;
    const creatorName = (formData.get("creatorName") as string) || "作成者";

    if (!name) {
      return NextResponse.json(
        { error: "AI先生の名前を入力してください。" },
        { status: 400 }
      );
    }

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "PDFファイルを選んでください。" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          error: "アップロードの設定がありません。",
          hint: process.env.VERCEL
            ? "Vercel の Project Settings → Environment Variables に SUPABASE_URL と SUPABASE_ANON_KEY を追加して Redeploy してください。"
            : "docs/SETUP.md を参照し、.env.local に SUPABASE_URL と SUPABASE_ANON_KEY を設定してください。",
        },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "contexts";

    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { contentType: "application/pdf" });

    if (uploadError) {
      console.error("[POST /api/upload] Storage error:", uploadError);
      const isBucketMissing =
        uploadError.message?.includes("Bucket") ||
        uploadError.message?.includes("not found");
      return NextResponse.json(
        {
          error: "ストレージへの保存に失敗しました。",
          hint: isBucketMissing
            ? "Supabase の Storage で「contexts」バケットを作成してください。"
            : "Supabase の設定（Storage・権限）を確認してください。",
        },
        { status: 502 }
      );
    }

    const path = uploadData.path;

    const extractedText = await extractTextFromPdf(file);

    const { data: teacher, error: insertError } = await supabase
      .from("teachers")
      .insert({
        name,
        creator_name: creatorName,
        promo_link: promoLink,
        storage_path: path,
        file_name: file.name,
        extracted_text: extractedText,
      })
      .select("id, name")
      .single();

    if (insertError) {
      console.error("[POST /api/upload] Insert error:", insertError);
      return NextResponse.json(
        {
          error: "登録に失敗しました。",
          hint: "Supabase で teachers テーブルを作成してください。docs/supabase-teachers-table.sql の SQL を実行してください。",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      teacherId: teacher.id,
      name: teacher.name,
      message: extractedText
        ? `「${teacher.name}」を作成しました。利用者は「話す」から選んで、アップロードした資料を参照して質問できます。`
        : `「${teacher.name}」を作成しました。利用者は「話す」から選んで使えます。（PDFのテキスト抽出に失敗したため、この先生のチャットでは資料を参照できません。別のPDFでお試しください。）`,
    });
  } catch (err) {
    console.error("[POST /api/upload]", err);
    return NextResponse.json(
      {
        error: "アップロードに失敗しました。",
        hint: "しばらくしてからもう一度お試しください。",
      },
      { status: 500 }
    );
  }
}
