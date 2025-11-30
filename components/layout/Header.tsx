"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

interface User {
  id: number;
  loginId: string;
  nickname: string;
  status: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [visitors, setVisitors] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisitors(Math.floor(Math.random() * 30));

    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleWithdraw = async () => {
    if (!user) return;

    const confirmed = confirm(
      "회원 탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.\n정말 탈퇴하시겠습니까?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/member/${user.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "회원 탈퇴 중 오류가 발생했습니다.");
        return;
      }

      alert("회원 탈퇴가 완료되었습니다.");
      localStorage.clear();
      window.location.href = "/";
    } catch (err) {
      console.error("회원 탈퇴 실패:", err);
      alert("회원 탈퇴 중 오류가 발생했습니다.");
    }
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="flex justify-end items-center px-10 py-4 gap-4">
        {user ? (
          <>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-gray-800 text-sm font-medium hover:text-gray-600 transition"
              >
                {user.nickname} 님 ▼
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      handleWithdraw();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-lg"
                  >
                    회원 탈퇴
                  </button>
                </div>
              )}
            </div>
            
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
