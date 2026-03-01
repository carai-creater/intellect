import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/teachers
 * 利用者モード: 選択できる AI先生一覧を返す。
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("teachers")
      .select("id, name, creator_name")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[GET /api/teachers]", error);
      return NextResponse.json(
        { error: "一覧の取得に失敗しました。", hint: "teachers テーブルが存在するか確認してください。" },
        { status: 502 }
      );
    }

    return NextResponse.json(
      (data || []).map((row) => ({
        id: row.id,
        name: row.name,
        creatorName: row.creator_name ?? null,
      }))
    );
  } catch (err) {
    console.error("[GET /api/teachers]", err);
    return NextResponse.json(
      { error: "一覧の取得に失敗しました。" },
      { status: 500 }
    );
  }
}
