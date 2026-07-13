import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";
import { generateJsonLd } from "@/constants/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "BuildBridge — Developer Collaboration Platform",
    template: "%s | BuildBridge",
  },
  description:
    "Discover projects, recruit teammates, and build amazing things together. BuildBridge connects developers with complementary skills for open-source collaboration.",
  keywords: [
    "developer collaboration",
    "project management",
    "open source",
    "team building",
    "software development",
    "find developers",
    "coding projects",
    "tech community",
  ],
  authors: [{ name: "BuildBridge Team" }],
  creator: "BuildBridge",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://buildbridge.vercel.app",
    siteName: "BuildBridge",
    title: "BuildBridge — Developer Collaboration Platform",
    description:
      "Discover projects, recruit teammates, and build amazing things together.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BuildBridge — Developer Collaboration Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BuildBridge — Developer Collaboration Platform",
    description:
      "Discover projects, recruit teammates, and build amazing things together.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="canonical" href="https://buildbridge.vercel.app" />
      </head>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJsonLd()) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
