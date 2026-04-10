import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { config } from "../config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: config.tdk.home.title,
  description: config.tdk.home.description,
  keywords: config.tdk.home.keywords,
  icons: {
    icon: '/images/logo-night.svg',
    shortcut: '/images/logo-night.svg',
    apple: '/images/logo-night.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 额外的图标配置 */}
        <link rel="apple-touch-icon-precomposed" href="/images/logo-night.svg" />
        <meta name="msapplication-TileImage" content="/images/logo-night.svg" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
