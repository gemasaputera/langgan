import type { Metadata } from "next";
import { Geist_Mono, Karla, Montserrat } from "next/font/google";
import "./globals.css";

const karla = Karla({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Langgan — Kelola Semua Langgananmu",
  description:
    "Pantau pengeluaran langganan, dapatkan pengingat pembayaran, dan kendalikan keuangan digitalmu dengan mudah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${karla.variable} ${geistMono.variable} ${montserrat.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
