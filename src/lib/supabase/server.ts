import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * サーバー専用 Supabase クライアント。
 * SUPABASE_URL / SUPABASE_ANON_KEY は NEXT_PUBLIC_ ではないため
 * クライアントバンドルに含まれず、ブラウザに送信されません。
 */
export async function createClient() {
  const supabaseUrl = process.env.SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? "";
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
