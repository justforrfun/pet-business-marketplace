'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
    const [visitors, setVisitors] = useState(0);

    useEffect(() => {
        setVisitors(Math.floor(Math.random() * 30));
    }, []);

    return (
        <header className="w-full border-b border-gray-200 bg-white">
            <div className="flex justify-end items-center px-10 py-4 gap-4">
                <Link
                    href="/signup"
                    className="border-2 border-gray-200 bg-white text-black px-4 py-2 rounded text-sm font-medium hover:bg-gray-100 transition">
                    회원가입
                </Link>
                <Link href="/login" className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700 transition">
                    로그인
                </Link>

                {/* 접속자 표시 */}
                <div className="text-gray-600 text-sm flex items-center">
                    <span>현재접속자&nbsp;</span>
                    <span className="inline-block w-[20px] text-right font-medium tabular-nums">
                        {visitors}
                    </span>
                    <span>명</span>
                </div>
            </div>
        </header>
    )
}