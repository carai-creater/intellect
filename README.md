# Intellect

PDF をアップロードして RAG を生成し、「AI先生」を作成。利用者の質問で作成者に収益（広告・投げ銭）を還元するプラットフォーム。

## 技術スタック

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS, lucide-react
- **Backend/DB:** Supabase (Auth, Storage, Vector DB)
- **AI:** Gemini 1.5 Flash (Google AI SDK `@google/genai`)
- **Architecture:** API・型は `src/lib` / `src/services` に分離し、将来の Expo アプリ化を想定

## プロジェクト構成

```
src/
├── app/                    # Next.js App Router
│   ├── api/
│   │   ├── chat/route.ts   # POST: RAG + Gemini でチャット返答
│   │   └── upload/route.ts # POST: PDF を Storage に保存（作成者モード）
│   ├── layout.tsx
│   ├── page.tsx            # トップ: PDF アップロードカード
│   └── globals.css
├── components/             # UI コンポーネント
│   └── PdfUploadCard.tsx   # 「Contextをアップロード」カード
├── lib/                    # 共通クライアント（Expo と共有しやすい形）
│   ├── supabase/           # ブラウザ・サーバー用 Supabase クライアント
│   └── gemini/             # Gemini 1.5 Flash クライアント（サーバーのみ）
├── services/               # ビジネスロジック
│   └── chat/               # RAG 回答生成（PDF 全文をコンテキストに注入）
└── types/                  # 共通型定義
    └── index.ts
```

## 環境変数

`.env.local` に以下を設定してください（`NEXT_PUBLIC_` ではないためサーバー専用でブラウザに送信されません）。

```env
# Supabase（サーバー専用）
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_STORAGE_BUCKET=contexts

# Gemini（サーバー専用）
GEMINI_API_KEY=...
```

## 開発

```bash
npm install
npm run dev
```

http://localhost:3000 で「Contextをアップロード」のカード型 UI が表示されます。

## API スケルトン

- **POST /api/chat**  
  本文: `{ "message": "ユーザーの質問", "contextId?: string" }`  
  返却: `{ "content": "AIの回答", "supportedBy?: { creatorName, promoLink } }`  
  現状はコンテキスト未紐づけで汎用回答。`contextId` から DB 取得する処理は TODO。

- **POST /api/upload**  
  `FormData`: `file` (PDF), 任意で `promoLink`, `creatorName`。  
  Supabase Storage への保存まで実装済み。DB 登録（宣伝リンク等）は TODO。
