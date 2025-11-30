'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Toggle Switch Component
function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-700">{label}</label>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
          checked ? 'bg-red-600' : 'bg-gray-300'
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  );
}

// Dropdown Component
function Dropdown({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-md border border-gray-300 bg-white pl-3 pr-8 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 appearance-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
}

export default function BoardPage() {
  const router = useRouter();
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState('10개씩');
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // itemsPerPage에서 숫자 추출
  const limit = parseInt(itemsPerPage.replace('개씩', ''), 10);

  // 게시글 데이터 로드
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: limit.toString(),
          showMyPosts: showMyPosts.toString(),
        });

        // TODO: 로그인된 사용자의 memberId를 가져와야 함
        // 현재는 임시로 빈 값 사용
        // if (showMyPosts) {
        //   params.append('memberId', memberId);
        // }

        const response = await fetch(`/api/board?${params.toString()}`);
        const result = await response.json();

        if (result.success) {
          setPosts(result.data.posts);
          setTotalPages(result.data.pagination.totalPages);
        } else {
          console.error('게시글 로드 실패:', result.error);
        }
      } catch (error) {
        console.error('게시글 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, limit, showMyPosts]);

  // 페이지 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [showMyPosts, itemsPerPage]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">게시판</h1>
        <div className="flex items-center gap-4">
          <ToggleSwitch
            checked={showMyPosts}
            onChange={setShowMyPosts}
            label="내 글 보기"
          />
          <Dropdown
            value={itemsPerPage}
            onChange={setItemsPerPage}
            options={['10개씩', '20개씩', '30개씩', '50개씩']}
          />
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                번호
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                제목
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                작성자
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                작성일
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  로딩 중...
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  게시글이 없습니다.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/board/${post.id}`)}
                >
                  <td className="px-6 py-4 text-sm text-gray-600">{post.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <Link
                      href={`/board/${post.id}`}
                      className="hover:text-red-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {post.author}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {post.date}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination and Write Button */}
      <div className="flex items-center justify-between">
        {/* Pagination */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={cn(
                'px-3 py-2 text-sm border rounded transition-colors',
                currentPage === page
                  ? 'bg-red-600 text-white border-red-600'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              )}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ml-1"
          >
            &gt;
          </button>
        </div>

        {/* Write Post Button */}
        <Link
          href="/board/write"
          className="px-6 py-2 text-sm border rounded bg-red-600 text-white hover:bg-red-700"
        >
          글쓰기
        </Link>
      </div>
    </div>
  );
}
