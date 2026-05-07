import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clarity — Website Messaging Analyzer",
  description: "Score how clearly your website communicates its value to a first-time visitor.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
