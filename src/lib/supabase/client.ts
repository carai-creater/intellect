import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * ブラウザ用 Supabase クライアント（認証などで使う場合）。
 * 現状は API 経由のみのため未使用。使う場合は NEXT_PUBLIC_SUPABASE_* を
 * 別途用意し、公開しても問題ない anon key に限定すること。
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
