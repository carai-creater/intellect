import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <h2 className="text-xl font-bold text-ink mb-2">ページが見つかりません</h2>
      <p className="text-sm text-ink/60 mb-6">お探しの URL は存在しないか、移動しました。</p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-apple-blue text-white font-medium text-sm"
      >
        トップへ戻る
      </Link>
    </div>
  );
}
