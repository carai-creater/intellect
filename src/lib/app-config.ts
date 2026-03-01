/**
 * アプリの表示名。任意の名前に変更できます。
 * 本番で変えたい場合は Vercel の環境変数 NEXT_PUBLIC_APP_NAME を設定してください。
 */
export const APP_NAME =
  typeof process.env.NEXT_PUBLIC_APP_NAME === "string" &&
  process.env.NEXT_PUBLIC_APP_NAME.trim() !== ""
    ? process.env.NEXT_PUBLIC_APP_NAME.trim()
    : "Intellect";
