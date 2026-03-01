import Link from "next/link";
import { IconUpload, IconMessageCircle } from "@/components/icons";

export default function HomePage() {
  return (
    <div className="p-6 md:p-8 max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-ink mb-1">何をしますか？</h2>
      <p className="text-sm text-ink/60 mb-8">
        やりたいことを選んでください。
      </p>

      <div className="flex flex-col gap-5">
        <Link
          href="/create"
          className="block p-6 rounded-2xl border-2 border-border bg-surface active:bg-border/50 transition-colors hover:border-ink/20"
        >
          <span className="inline-block text-xs font-medium text-apple-blue mb-3">① まずはこちら</span>
          <IconUpload className="w-9 h-9 text-ink/70 mb-3" />
          <h3 className="text-lg font-semibold text-ink mb-1.5">
            AI先生を作る
          </h3>
          <p className="text-sm text-ink/60 leading-relaxed">
            PDFを1つ用意してアップロードするだけ。その内容で答えられるAI先生ができます。
          </p>
        </Link>

        <Link
          href="/chat"
          className="block p-6 rounded-2xl border-2 border-border bg-surface active:bg-border/50 transition-colors hover:border-ink/20"
        >
          <span className="inline-block text-xs font-medium text-ink/50 mb-3">② 作ったあとに</span>
          <IconMessageCircle className="w-9 h-9 text-ink/70 mb-3" />
          <h3 className="text-lg font-semibold text-ink mb-1.5">
            AI先生と話す
          </h3>
          <p className="text-sm text-ink/60 leading-relaxed">
            質問を入力すると、AI先生が答えます。誰かが作ったAI先生にも質問できます。
          </p>
        </Link>
      </div>
    </div>
  );
}
