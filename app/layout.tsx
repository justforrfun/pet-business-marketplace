import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'My App',
  description: 'Next.js + Supabase Project'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex">
        { /* Sidebar 자리 */}
        { /* Header 자리 */}
        <main className="flex-1 flex flex-col min-h-screen bg-white">
          <div className="flex-1 p-8">{children}</div>
        </main>
      </body>
    </html>
  )
}