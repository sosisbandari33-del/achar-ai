import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ACHAR AI — Smart Toolbox (جعبه ابزار هوش مصنوعی)",
  description: "An Apple-style minimalist, all-in-one AI toolbox web application for tech exhibitions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-[#F5F5F7] text-slate-800 antialiased selection:bg-blue-600/10 selection:text-blue-600">
        {children}
      </body>
    </html>
  );
}
