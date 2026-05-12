//app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yura",
  description: "Student project collaboration platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="sticky top-0 z-50">
          <Link
            href="/pricing"
            className="group block border-b bg-gradient-to-r from-indigo-600 to-indigo-500 text-white"
          >
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">
                  Premium plans are live: Starter ($5/mo) + Pro ($7/mo)
                </div>
                <div className="text-xs text-indigo-100 truncate">
                  Featured badge, better matching, boosts, and more. Tap to view pricing.
                </div>
              </div>
              <span className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-bold text-indigo-600 transition-transform group-hover:scale-105">
                View plans
              </span>
            </div>
          </Link>
        </div>
        {children}
      </body>
    </html>
  );
}
