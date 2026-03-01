"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <h2 className="text-xl font-bold text-ink mb-2">エラーが発生しました</h2>
      <p className="text-sm text-ink/60 mb-6 text-center max-w-md">
        {error.message || "問題が発生しました。"}
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-xl bg-apple-blue text-white font-medium text-sm"
      >
        もう一度試す
      </button>
    </div>
  );
}
