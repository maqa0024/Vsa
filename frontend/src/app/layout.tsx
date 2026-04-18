import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dərs Cədvəli İdarəetmə Sistemi",
  description: "University Academic Scheduling System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az">
      <body>{children}</body>
    </html>
  );
}
