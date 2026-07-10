import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BuildBridge - Developer Collaboration Platform",
  description:
    "Discover projects, recruit teammates, and build amazing things together. BuildBridge connects developers with complementary skills.",
  keywords: [
    "developer collaboration",
    "project management",
    "open source",
    "team building",
    "software development",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
