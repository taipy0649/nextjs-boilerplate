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

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Make sure we always use the same className string (not dynamic generation)
  const bodyClasses = `${geistSans.variable} ${geistMono.variable} antialiased`;

  return (
    <html lang="en">
      <body className={bodyClasses}>{children}</body>
    </html>
  );
}
