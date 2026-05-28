import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AccuRadio AI Station",
  description: "Continuous AI-hosted radio with hourly news and genre scheduling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
