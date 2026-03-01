import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";

export default function AppLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white pb-16">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <BottomNav />
    </div>
  );
}
