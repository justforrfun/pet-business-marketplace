import type { Metadata } from "next";
import "./globals.css";
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Next.js + Supabase Project'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex">
        <Sidebar />
        <main className="flex-1 flex flex-col min-h-screen bg-white">
          <Header />
          <div className="flex-1 p-8">{children}</div>
        </main>
      </body>
    </html>
  )
}