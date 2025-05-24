import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anemia Support Chatbot",
  description: "Get help and insights for your anemia-related concerns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Script 
          src="https://elevenlabs.io/convai-widget/index.js" 
          strategy="afterInteractive" 
        />
      </body>
    </html>
  );
}
