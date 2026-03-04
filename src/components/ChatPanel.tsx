"use client";

import { useCallback, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  supportedBy?: { creatorName: string; promoLink: string | null };
}

interface ChatPanelProps {
  /** 選択したAI先生のID（ある場合、その先生のコンテキストで回答） */
  contextId?: string | null;
  /** 表示用の先生名 */
  teacherName?: string;
}

export function ChatPanel({ contextId, teacherName }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<"gemini" | "openai">("gemini");
  const bottomRef = useRef<HTMLDivElement>(null);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          contextId: contextId || undefined,
          model,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        const errMsg = [data?.error, data?.hint].filter(Boolean).join("\n\n") || "エラーが発生しました。しばらくしてからもう一度お試しください。";
        setMessages((m) => [...m, { role: "assistant", content: errMsg }]);
        return;
      }

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.content,
          supportedBy: data.supportedBy,
        },
      ]);
    } catch {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "接続に失敗しました。ネットワークを確認して、もう一度お試しください。" },
        ]);
    } finally {
      setLoading(false);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [input, loading, contextId]);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-10 px-4">
            <p className="text-sm font-medium text-ink/70 mb-1">まだメッセージはありません</p>
            <p className="text-sm text-ink/50">
              {teacherName
                ? `「${teacherName}」に質問できます。`
                : "下の欄に質問を入力して「送信」を押すと、AI先生が答えます。"}
            </p>
            <p className="text-xs text-ink/40 mt-1">
              現在のプロバイダ: <strong className="text-ink">{model === "gemini" ? "Gemini" : "OpenAI"}</strong>
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.role === "user"
                ? "flex justify-end"
                : "flex justify-start"
            }
          >
            <div
              className={
                msg.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 bg-apple-blue text-white text-sm"
                  : "max-w-[85%] rounded-2xl rounded-bl-md px-4 py-2.5 bg-surface text-ink text-sm border border-border"
              }
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.supportedBy && (
                <p className="mt-2 pt-2 border-t border-border/50 text-xs text-ink/60">
                  {msg.supportedBy.promoLink ? (
                    <>
                      <span className="text-ink/50">作成: </span>
                      <a
                        href={msg.supportedBy.promoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-apple-blue underline"
                      >
                        {msg.supportedBy.creatorName}
                      </a>
                    </>
                  ) : (
                    <>作成: {msg.supportedBy.creatorName}</>
                  )}
                </p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md px-4 py-2.5 bg-surface text-ink/50 text-sm border border-border">
              ...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-border bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <label htmlFor="model-select" className="text-sm text-ink/60">
              プロバイダ:
            </label>
            <select
              id="model-select"
              value={model}
              onChange={(e) => setModel(e.target.value as "gemini" | "openai")}
              className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-apple-blue/30"
              disabled={loading}
            >
              <option value="gemini">Gemini</option>
              <option value="openai">OpenAI</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="質問を入力して送信"
              className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-apple-blue/30"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-apple-blue text-white text-sm font-medium disabled:opacity-50"
            >
              送信
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
