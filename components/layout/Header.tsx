'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Header() {
    const [visitors, setVisitors] = useState(0);

    useEffect(() => {
        setVisitors(Math.floor(Math.random() * 30));
    }, []);

    return (
        <header className="flex justify-between items-center px-6 py-4 border-b bg-white shadow-xm">
            <Link href="/">
                <Image src="/logo.png" alt="logo" width={120} height={40} />
            </Link>
            <div className="text-gray-600 text-sm">
                접속자: <span className="font-semibold">{visitors}</span>명
            </div>
        </header>
    )
}