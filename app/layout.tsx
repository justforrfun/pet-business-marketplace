import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import RightBanner from '@/components/layout/RightBanner';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Next.js + Supabase Project',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="flex">
        <Sidebar />

        <main className="flex-1 flex flex-col min-h-screen bg-white relative">
          <Header />

          <div className="flex-1 w-full max-w-6xl mx-auto px-10 py-8">{children}</div>
        </main>

        {/* 오른쪽 배너 영역 */}
        <RightBanner />
      </body>
    </html>
  );
}
