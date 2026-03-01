-- Supabase SQL Editor で実行してください。
-- AI先生一覧用のテーブルを作成します。

CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  creator_name TEXT,
  promo_link TEXT,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  extracted_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 一覧取得・1件取得を許可（anon でも読めるようにする）
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read"
  ON public.teachers FOR SELECT
  TO public
  USING (true);

-- アップロード時は anon で INSERT できるようにする（本番では認証後に制限推奨）
CREATE POLICY "Allow public insert"
  ON public.teachers FOR INSERT
  TO public
  WITH CHECK (true);

COMMENT ON TABLE public.teachers IS 'AI先生一覧。PDFアップロード時に1件ずつ追加。';
