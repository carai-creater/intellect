import Link from "next/link";
import { APP_NAME } from "@/lib/app-config";

export default function StartPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center gap-10 max-w-md w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-ink tracking-tight text-center">
          {APP_NAME}
        </h1>
        <p className="text-base text-ink/70 text-center leading-relaxed">
          PDFでAI先生を作り、
          <br />
          学びを届ける。
        </p>
        <div className="w-full rounded-2xl bg-surface border border-border p-5 text-left">
          <p className="text-sm font-medium text-ink mb-2">このアプリでできること</p>
          <ul className="text-sm text-ink/70 space-y-1.5">
            <li>・<strong>AI先生を作る</strong> … PDFを1つアップロードするだけ</li>
            <li>・<strong>AI先生と話す</strong> … 質問を入力するとAIが答える</li>
          </ul>
        </div>
        <Link
          href="/home"
          className="w-full max-w-xs py-4 rounded-2xl text-white font-medium text-center text-base bg-apple-blue active:opacity-90"
          aria-label="アプリのメニューへ進む"
        >
          はじめる
        </Link>
      </div>
    </main>
  );
}
