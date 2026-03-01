import Link from "next/link";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-border">
      <div className="h-14 flex items-center justify-center px-4">
        <Link href="/home" className="text-lg font-semibold text-ink">
          Intellect
        </Link>
      </div>
    </header>
  );
}
