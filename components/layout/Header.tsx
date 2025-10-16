'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
    const [visitors, setVisitors] = useState(0);

    useEffect(() => {
        setVisitors(Math.floor(Math.random() * 30));
    }, []);

    return (
        <header className="flex justify-between items-center px-6 py-4 border-b bg-white shadow-xm">
            <Link href="/signup" className="border px-4 py-2 rounded text-sm hover:bg-gray-100">
                회원가입
            </Link>
            <Link href="/login" className="bg-red-600 text-white px-4 py-2 rounded text-sm">
                로그인
            </Link>
            <div className="text-gray-600 text-sm">현재 접속자 {visitors}</div>
        </header>
    )
}