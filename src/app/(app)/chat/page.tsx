import { ChatWithTeacher } from "@/components/ChatWithTeacher";

export default function ChatPage() {
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto h-full">
      <h2 className="text-xl font-bold text-ink mb-1">AI先生と話す</h2>
      <ChatWithTeacher />
    </div>
  );
}
