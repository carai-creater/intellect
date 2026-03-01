import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Intellect",
  description: "Contextをアップロードして、AI先生を作成",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased font-sans text-ink bg-white">
        {children}
      </body>
    </html>
  );
}
