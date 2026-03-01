# GitHub への保存と Vercel デプロイ手順

## 1. GitHub にリポジトリを作成してプッシュ

### 1-1. GitHub で新しいリポジトリを作る

1. https://github.com/new を開く
2. **Repository name** に `Intellect`（または任意の名前）を入力
3. **Public** を選択
4. **Add a README file** は**チェックしない**（既にローカルにあるため）
5. **Create repository** をクリック

### 1-2. ローカルからプッシュする

GitHub でリポジトリを作成すると、画面に「…or push an existing repository from the command line」と表示されます。そのコマンドを実行します。

**HTTPS の場合（推奨）:**

```bash
cd c:\Users\renta\Intellect
git remote add origin https://github.com/あなたのユーザー名/Intellect.git
git branch -M main
git push -u origin main
```

**SSH の場合:**

```bash
cd c:\Users\renta\Intellect
git remote add origin git@github.com:あなたのユーザー名/Intellect.git
git branch -M main
git push -u origin main
```

- `あなたのユーザー名` を自分の GitHub ユーザー名に置き換える
- リポジトリ名を変えた場合は `Intellect` の部分も合わせて変更する
- プッシュ時に GitHub のログイン（またはトークン）を求められたら入力する

---

## 2. Vercel に GitHub からデプロイする

### 2-1. Vercel でプロジェクトをインポート

1. https://vercel.com にログイン（GitHub アカウントで連携すると楽）
2. **Add New…** → **Project** をクリック
3. **Import Git Repository** で **GitHub** を選び、表示された一覧から **Intellect**（先ほどプッシュしたリポジトリ）を選ぶ
4. **Import** をクリック

### 2-2. 環境変数を設定する

**Configure Project** の画面で **Environment Variables** を開き、次の変数を追加する。

| Name | Value | 備考 |
|------|--------|------|
| `SUPABASE_URL` | あなたの Supabase Project URL | Supabase の Project Settings → API |
| `SUPABASE_ANON_KEY` | あなたの Supabase anon key | 同上 |
| `SUPABASE_STORAGE_BUCKET` | `contexts` | そのまま |
| `GEMINI_API_KEY` | あなたの Gemini API キー | Google AI Studio で発行 |

- 各値は **.env.local** に書いているものと同じでよい
- **Production / Preview / Development** のうち、本番だけなら Production にチェック

### 2-3. デプロイする

1. **Deploy** をクリック
2. ビルドが終わると、**Congratulations!** と表示され、本番 URL（例: `https://intellect-xxx.vercel.app`）が発行される
3. その URL を開いて動作を確認する

---

## 注意事項

- **.env.local** は GitHub に含まれていません（.gitignore で除外済み）。Vercel では上記の環境変数を手動で設定してください。
- 本番でも Supabase の **teachers** テーブルと **contexts** バケットが作成済みである必要があります。
- 必要に応じて、Supabase の **Authentication** で本番ドメインを許可リストに追加してください。
