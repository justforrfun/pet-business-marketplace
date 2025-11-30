'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: '🏠 홈', href: '/' },
    { name: '💬 게시판', href: '/board' },
  ];

  return (
    <aside className="w-52 min-h-screen border-r border-gray-200 bg-gray-50 p-6 flex flex-col">
      {/* 상단 브랜드 영역 */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 cursor-pointer"
        >
          Logo
        </Link>
      </div>

      {/* 메뉴 영역 */}
      <nav className="flex flex-col gap-4 flex-1">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`text-base flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              pathname === item.href
                ? 'bg-gray-200 text-gray-900 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
