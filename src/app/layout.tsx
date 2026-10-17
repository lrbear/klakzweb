import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KLAKZHUB — Developer Resource Library",
  description: "Discover useful developer resources, tools, scripts and utilities.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
