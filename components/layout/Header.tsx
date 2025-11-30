"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  id: number;
  loginId: string;
  nickname: string;
  status: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [visitors, setVisitors] = useState(0);

  useEffect(() => {
    setVisitors(Math.floor(Math.random() * 30));

    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = async () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="flex justify-end items-center px-10 py-4 gap-4">
        {user ? (
          <>
            <span className="text-gray-800 text-sm font-medium">
              {user.nickname} 님
            </span>
            <button
              onClick={handleLogout}
              className="bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-700 transition"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link
              href="/signup"
              className="border-2 border-gray-200 px-4 py-2 rounded text-sm font-medium hover:bg-gray-100 transition"
            >
              회원가입
            </Link>
            <Link
              href="/login"
              className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700 transition"
            >
              로그인
            </Link>
          </>
        )}

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
  );
}
