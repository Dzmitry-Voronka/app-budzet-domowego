import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Budżet Domowy",
  description: "Zarządzaj swoimi finansami domowymi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
