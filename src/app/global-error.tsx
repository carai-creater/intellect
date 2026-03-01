"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#fff", color: "#1D1D1F" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 8 }}>エラーが発生しました</h2>
          <p style={{ fontSize: "0.875rem", color: "#666", marginBottom: 24, textAlign: "center", maxWidth: 400 }}>
            {error.message || "問題が発生しました。ページを更新してください。"}
          </p>
          <button
            onClick={reset}
            style={{ padding: "12px 24px", borderRadius: 12, background: "#007AFF", color: "#fff", border: "none", fontWeight: 500, cursor: "pointer" }}
          >
            もう一度試す
          </button>
        </div>
      </body>
    </html>
  );
}
