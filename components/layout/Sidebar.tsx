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
        <aside className="w-52 min-h-screen border-r border-gray-200 bg-white p-6 flex flex-col">
            {/* 상단 브랜드 영역 */}
            <div className="mb-8">
                <Link href="/" className="text-2xl font-bold text-gray-800 cursor-pointer">
                    Company
                </Link>
            </div>

            {/* 메뉴 영역 */}
            <nav className="flex flex-col gap-4 flex-1">
                {menu.map((item => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`text-base flex items-center gap-2 ${pathname === item.href
                            ? 'text-blue-600 font-semibold'
                            : 'text-gray-700 hover:text-blue-500'
                            }`}>
                        {item.name}
                    </Link>
                )))}
            </nav>
        </aside>
    )
}