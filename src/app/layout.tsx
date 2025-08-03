import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/chat-widget";

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
      <body className="bg-black text-white min-h-screen">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
