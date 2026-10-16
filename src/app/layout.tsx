import type { Metadata } from "next";
import { Big_Shoulders, JetBrains_Mono, Noto_Sans_JP, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/chat-widget";
import { Analytics } from '@vercel/analytics/react';
import { ChatProvider } from "@/contexts/chat-context";

const display = Big_Shoulders({ subsets: ["latin"], weight: ["800", "900"], variable: "--font-display" });
const body = Space_Grotesk({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const jp = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "900"], variable: "--font-jp", preload: false });

const tagline = "Software engineer in New York. I find the problem that's costing money and use AI to ship the fix fast.";

export const metadata: Metadata = {
  title: "Akshit Dayal | Software Engineer",
  description: tagline,
  keywords: ["Akshit Dayal", "Full-Stack Developer", "AI", "Machine Learning", "Next.js", "React", "Portfolio"],
  authors: [{ name: "Akshit Dayal" }],
  creator: "Akshit Dayal",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://akshitdayal.com",
    title: "Akshit Dayal | Software Engineer",
    description: tagline,
    siteName: "Akshit Dayal Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akshit Dayal | Software Engineer",
    description: tagline,
    creator: "@AkshitDayal8",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${display.variable} ${body.variable} ${mono.variable} ${jp.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Mozilla+Text:wght@200..700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-black text-white min-h-screen">
        <ChatProvider>
          {children}
          <ChatWidget />
          <Analytics />
        </ChatProvider>
      </body>
    </html>
  );
}
