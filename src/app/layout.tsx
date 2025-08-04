import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/chat-widget";
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: "Akshit Dayal | Full-Stack Developer & AI Enthusiast",
  description: "Full-Stack Developer who has worked with multiple startups and currently leveraging the power of AI to build beautiful things",
  keywords: ["Akshit Dayal", "Full-Stack Developer", "AI", "Machine Learning", "Next.js", "React", "Portfolio"],
  authors: [{ name: "Akshit Dayal" }],
  creator: "Akshit Dayal",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://akshitdayal.com",
    title: "Akshit Dayal | Full-Stack Developer & AI Enthusiast",
    description: "Full-Stack Developer who has worked with multiple startups and currently leveraging the power of AI to build beautiful things",
    siteName: "Akshit Dayal Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akshit Dayal | Full-Stack Developer & AI Enthusiast",
    description: "Full-Stack Developer who has worked with multiple startups and currently leveraging the power of AI to build beautiful things",
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
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Mozilla+Text:wght@200..700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-black text-white min-h-screen">
        {children}
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  );
}
