# セットアップ手順（アップロードの設定がありません を解消する）

「アップロードの設定がありません。」と出たら、次の手順で Supabase を設定してください。

---

## 1. Supabase のプロジェクトを作る

1. [https://supabase.com](https://supabase.com) にアクセスしてログイン（またはアカウント作成）
2. **New project** で新しいプロジェクトを作成
3. プロジェクト名・データベースのパスワードを決めて作成（しばらく待つ）

---

## 2. URL とキーをコピーする

1. プロジェクトができたら、左メニュー **Project Settings**（歯車アイコン）を開く
2. **API** をクリック
3. 次の2つをメモする：
   - **Project URL** → これが `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys** の **anon public** → これが `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 3. プロジェクトに `.env.local` を作る

1. Intellect のプロジェクトフォルダ（`package.json` がある場所）を開く
2. 同じ場所に **`.env.local`** という名前のファイルを新規作成する
3. 中身を次のように書く（`xxxx` の部分を、手順2でコピーした値に置き換える）：

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_STORAGE_BUCKET=contexts
```

- 行の途中にスペースや余計な記号を入れない
- 値は **ダブルクォートで囲まない**（そのまま貼り付けてOK）
- これらの変数は **NEXT_PUBLIC_ ではありません**。サーバーだけで使うため、ブラウザに送られず、より安全です。

---

## 4. AI先生一覧用のテーブルを作る

1. Supabase ダッシュボードで **SQL Editor** を開く
2. プロジェクトルートの **`docs/supabase-teachers-table.sql`** の内容をコピーして実行する
3. これで「先生を選んでチャットする」機能で使う `teachers` テーブルができる

## 5. Storage のバケットを作る

1. Supabase のダッシュボードで、左メニュー **Storage** を開く
2. **New bucket** をクリック
3. 名前を **`contexts`** と入力
4. **Create bucket** で作成
5. 作成したバケットを開き、**Policies** で「公開でアップロードを許可」など必要なポリシーを設定（テストなら「Allow all」でも可）

---

## 6. 開発サーバーを再起動する

`.env.local` を変更したら、Next.js が読み直すために再起動が必要です。

1. ターミナルで `npm run dev` を実行中なら **Ctrl+C** で止める
2. もう一度 **`npm run dev`** を実行する
3. ブラウザでアプリを開き、もう一度 PDF をアップロードしてみる

---

## 7. うまくいかないとき

- **「ストレージへの保存に失敗しました」** → Storage でバケット名が **`contexts`** か確認。バケットのポリシーでアップロードが許可されているか確認。
- **まだ「設定がありません」** → `.env.local` がプロジェクトの**ルート**（`package.json` と同じ階層）にあるか確認。ファイル名が `.env.local` で、先頭に余計なスペースがないか確認。
- 変更後は必ず **`npm run dev` を再起動**してください。
