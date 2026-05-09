import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JIESURT | International Journal",
  description: "Innovative Engineering Science and Universal Research Trends",
  icons: {
    icon: "/papers/JIESURT_Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#f1f5f9]`}>
        {children}
      </body>
    </html>
  );
}
