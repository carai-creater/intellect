"use client";

import { useCallback, useEffect, useState } from "react";
import { ChatPanel } from "./ChatPanel";

interface Teacher {
  id: string;
  name: string;
  creatorName: string | null;
}

export function ChatWithTeacher() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Teacher | null>(null);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teachers");
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setTeachers(data);
      } else {
        setTeachers([]);
      }
    } catch {
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  if (selected) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="text-sm text-apple-blue font-medium"
          >
            ← 別の先生を選ぶ
          </button>
          <span className="text-lg font-semibold text-ink">{selected.name}</span>
        </div>
        <ChatPanel contextId={selected.id} teacherName={selected.name} />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <p className="text-sm text-ink/60 mb-4">
        話したいAI先生を選んでください。
      </p>
      {loading ? (
        <p className="text-sm text-ink/50 py-8">読み込み中…</p>
      ) : teachers.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-6 text-center">
          <p className="text-sm text-ink/70">まだAI先生がいません</p>
          <p className="text-sm text-ink/50 mt-1">
            「作る」タブからPDFをアップロードして、先生を作成してください。
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {teachers.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setSelected(t)}
                className="w-full text-left p-4 rounded-2xl border-2 border-border bg-surface hover:border-ink/20 transition-colors"
              >
                <span className="font-semibold text-ink">{t.name}</span>
                {t.creatorName && (
                  <span className="block text-xs text-ink/50 mt-1">
                    作成: {t.creatorName}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
