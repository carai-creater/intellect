import { PdfUploadCard } from "@/components/PdfUploadCard";

export default function CreatePage() {
  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <h2 className="text-xl font-bold text-ink mb-1">AI先生を作る</h2>
        <p className="text-sm text-ink/60 mb-6">
          用意するものは<strong>PDFファイル1つ</strong>だけ。下のエリアにドラッグするか、「ファイルを選択」から選んでください。
        </p>
        <PdfUploadCard />
      </div>
    </div>
  );
}
