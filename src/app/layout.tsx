import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteName = "ことぽけ";
const description =
  "どこかで出会った気になることば。ポケットへしまうように、集めてみませんか。";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://kotopoke.com",
  ),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description,
  applicationName: siteName,
  openGraph: {
    title: siteName,
    description,
    siteName,
    type: "website",
    locale: "ja_JP",
    images: [
      {
        url: "/kotopoke_main_logo.png",
        width: 1160,
        height: 1200,
        alt: "ことぽけ",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: siteName,
    description,
    images: ["/kotopoke_main_logo.png"],
  },
  icons: {
    icon: "/kotopoke_small.png",
    apple: "/kotopoke_small.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
