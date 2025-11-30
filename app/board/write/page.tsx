'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function WriteBoardPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxContentLength = 1000;
  const contentLength = content.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    if (content.length > maxContentLength) {
      alert(`내용은 ${maxContentLength}자 이하로 입력해주세요.`);
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: 로그인된 사용자의 memberId를 가져와야 함
      const response = await fetch('/api/board', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          // memberId: currentUser.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/board');
      } else {
        alert(result.error || '게시글 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 등록 오류:', error);
      alert('게시글 등록 중 오류가 발생했습니다.');
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
            maxLength={200}
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
            maxLength={maxContentLength}
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
    </div>
  );
}
