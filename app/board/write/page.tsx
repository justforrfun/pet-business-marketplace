'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { AlertDialog } from '@/components/ui/alert-dialog';

interface User {
  id: number;
  loginId: string;
  nickname: string;
  status: string;
}

export default function WriteBoardPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const maxTitleLength = 30;
  const maxContentLength = 1000;
  const contentLength = content.length;

  const showAlert = useCallback((message: string) => {
    setAlertMessage(message);
    setAlertOpen(true);
  }, []);

  useEffect(() => {
    // 로그인 확인
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // 로그인하지 않은 경우 로그인 페이지로 이동
      showAlert('로그인이 필요합니다.');
      setTimeout(() => {
        router.push('/login');
      }, 500);
    }
  }, [router, showAlert]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showAlert('로그인이 필요합니다.');
      return;
    }

    if (!title.trim()) {
      showAlert('제목을 입력해 주세요.');
      return;
    }

    if (title.length > maxTitleLength) {
      showAlert(`제목은 최대 ${maxTitleLength}자까지 입력 가능합니다.`);
      return;
    }

    if (!content.trim()) {
      showAlert('내용을 입력해 주세요.');
      return;
    }

    if (content.length > maxContentLength) {
      showAlert(`제목은 최대 ${maxContentLength}자까지 입력 가능합니다.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/board', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          memberId: user.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/board');
      } else {
        showAlert(result.error || '게시글 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 등록 오류:', error);
      showAlert('게시글 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">게시판 글쓰기</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Title Input */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="title"
            className="text-base font-medium text-gray-900"
          >
            제목 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="h-10"
          />
        </div>

        {/* Content Input */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="content"
            className="text-base font-medium text-gray-900"
          >
            내용 <span className="text-red-500">*</span>
          </Label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            className={cn(
              'min-h-[400px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'placeholder:text-muted-foreground',
              'resize-y'
            )}
          />
          <div className="flex justify-end">
            <span
              className={cn(
                'text-sm text-gray-500',
                contentLength > maxContentLength && 'text-red-500'
              )}
            >
              {contentLength}/{maxContentLength}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700 text-white px-8"
          >
            {isSubmitting ? '등록 중...' : '등록'}
          </Button>
        </div>
      </form>

      {/* Alert Dialog */}
      <AlertDialog
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        description={alertMessage}
      />
    </div>
  );
}
