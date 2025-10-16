'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const menu = [
        { name: '홈', href: '/' },
        { name: '게시판', href: '/board' },
    ];

    return (
        <aside className="w-52 min-h-screen border-r bg-gray-50 p-6 flex flex-col">
            {/* 로고 영역 */}
            <div className="flex items-center mb-10">
                <Image src="/logo.png" alt="logo" width={120} height={40} />
            </div>

            {/* 메뉴 영역 */}
            <nav className="flex flex-col gap-4">
                {menu.map((item => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`text-lg ${pathname === item.href
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