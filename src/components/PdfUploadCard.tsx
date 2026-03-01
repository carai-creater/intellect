"use client";

import { useCallback, useState } from "react";
import { IconUpload } from "./icons";

const APPLE_BLUE = "#007AFF";
const BORDER = "#E5E5E7";
const SURFACE = "#F5F5F7";

export function PdfUploadCard() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [teacherName, setTeacherName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f?.type === "application/pdf") setFile(f);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f?.type === "application/pdf") setFile(f);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!file) return;
    const name = teacherName.trim();
    if (!name) {
      alert("AI先生の名前を入力してください。");
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("name", name);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = [data?.error, data?.hint].filter(Boolean).join("\n\n") || "アップロードに失敗しました。";
        throw new Error(msg);
      }
      const data = await res.json().catch(() => ({}));
      if (data?.message) {
        alert(data.message);
      }
      setFile(null);
      setTeacherName("");
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : "アップロードに失敗しました。ネットワークを確認して、もう一度お試しください。";
      alert(msg);
    } finally {
      setIsUploading(false);
    }
  }, [file, teacherName]);

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl border border-[#E5E5E7] shadow-sm p-10 md:p-14">
      <h3 className="text-lg font-bold text-ink mb-2 tracking-tight">
        PDFをアップロード
      </h3>
      <p className="text-sm text-ink/50 mb-6">※PDF形式のファイルだけ使えます</p>

      <label className="block text-sm font-medium text-ink mb-2">
        AI先生の名前
      </label>
      <input
        type="text"
        value={teacherName}
        onChange={(e) => setTeacherName(e.target.value)}
        placeholder="例: 歴史先生"
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink/40 mb-6"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-2xl flex flex-col items-center justify-center
          min-h-[200px] transition-colors
          ${isDragging ? "border-[var(--apple-blue)] bg-[#F5F5F7]" : "border-[#E5E5E7] bg-[#F5F5F7]"}
        `}
        style={{ borderColor: isDragging ? APPLE_BLUE : BORDER, backgroundColor: SURFACE }}
      >
        <IconUpload className="w-10 h-10 text-ink/50 mb-4" />
        <p className="text-base text-ink/70 mb-2">
          PDFをここにドラッグ＆ドロップ
        </p>
        <p className="text-sm text-ink/50 mb-4">または</p>
        <label className="cursor-pointer">
          <span
            className="inline-block px-5 py-2.5 rounded-xl text-white font-medium text-sm"
            style={{ backgroundColor: APPLE_BLUE }}
          >
            ファイルを選択
          </span>
          <input
            type="file"
            accept="application/pdf"
            className="sr-only"
            onChange={handleChange}
          />
        </label>
        {file && (
          <p className="mt-4 text-sm text-ink/80 font-medium">
            選択中: {file.name}
          </p>
        )}
      </div>

      {file && (
        <>
          <p className="mt-4 text-sm text-ink/60">
            この内容でよければ、下のボタンを押してください。
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isUploading}
            className="mt-4 w-full py-3 rounded-xl text-white font-medium text-base disabled:opacity-60"
            style={{ backgroundColor: APPLE_BLUE }}
          >
            {isUploading ? "アップロード中…" : "アップロードする"}
          </button>
        </>
      )}
    </div>
  );
}
