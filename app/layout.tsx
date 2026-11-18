import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import AccessGuard from "./components/AccessGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VR Studio Lab | Gestão de Inventário",
  description:
    "Sistema de gestão de equipamentos e inventário do VR Studio Lab.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AccessGuard>
          <div className="flex min-h-screen bg-[#0b1120] text-white">
            <Sidebar />

            <div className="flex min-w-0 flex-1 flex-col">
              <main className="flex-1">
                {children}
              </main>

              <Footer />
            </div>
          </div>
        </AccessGuard>
      </body>
    </html>
  );
}