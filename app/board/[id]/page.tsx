'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface PostDetail {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  member_id: number;
}

export default function BoardDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const maxContentLength = 1000;

  // 게시글 상세 조회
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/board/${id}`);
        const result = await response.json();

        if (result.success) {
          setPost(result.data);
          setEditTitle(result.data.title);
          setEditContent(result.data.content);
        } else {
          alert(result.error || '게시글을 불러올 수 없습니다.');
          router.push('/board');
        }
      } catch (error) {
        console.error('게시글 조회 오류:', error);
        alert('게시글 조회 중 오류가 발생했습니다.');
        router.push('/board');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, router]);

  // 수정 모드 토글
  const handleEdit = () => {
    setIsEditing(true);
  };

  // 수정 취소
  const handleCancel = () => {
    if (post) {
      setEditTitle(post.title);
      setEditContent(post.content);
    }
    setIsEditing(false);
  };

  // 수정 저장
  const handleUpdate = async () => {
    if (!editTitle.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!editContent.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    if (editContent.length > maxContentLength) {
      alert(`내용은 ${maxContentLength}자 이하로 입력해주세요.`);
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: 로그인된 사용자의 memberId를 가져와야 함
      const response = await fetch(`/api/board/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          content: editContent.trim(),
          // memberId: currentUser.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // 게시글 다시 조회
        const fetchResponse = await fetch(`/api/board/${id}`);
        const fetchResult = await fetchResponse.json();
        if (fetchResult.success) {
          setPost(fetchResult.data);
          setEditTitle(fetchResult.data.title);
          setEditContent(fetchResult.data.content);
        }
        setIsEditing(false);
        alert('게시글이 수정되었습니다.');
      } else {
        alert(result.error || '게시글 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 수정 오류:', error);
      alert('게시글 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 삭제
  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/board/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        alert('게시글이 삭제되었습니다.');
        router.push('/board');
      } else {
        alert(result.error || '게시글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
      alert('게시글 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="py-8 text-center text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="py-8 text-center text-gray-500">
          게시글을 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Edit/Delete Buttons */}
      <div className="flex justify-end mb-20">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={isSubmitting}
              className="border-gray-300"
            >
              취소
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? '저장 중...' : '저장'}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              onClick={handleEdit}
              variant="outline"
              className="border-gray-300"
            >
              수정
            </Button>
            <Button
              onClick={handleDelete}
              variant="outline"
              disabled={isDeleting}
              className="border-gray-300"
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </Button>
          </div>
        )}
      </div>

      {/* Post Title */}
      <div className="mb-4">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="edit-title"
              className="text-base font-medium text-gray-900"
            >
              제목 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-title"
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="h-10"
              maxLength={200}
            />
          </div>
        ) : (
          <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
        )}
      </div>

      {/* Post Metadata */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
        <span>작성자 {post.author}</span>
        <span>작성일 {post.date}</span>
      </div>

      {/* Separator */}
      <div className="border-t border-gray-200 mb-6"></div>

      {/* Content */}
      <div className="mb-8">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="edit-content"
              className="text-base font-medium text-gray-900"
            >
              내용 <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="edit-content"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
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
                  editContent.length > maxContentLength && 'text-red-500'
                )}
              >
                {editContent.length}/{maxContentLength}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-gray-900 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>
        )}
      </div>
    </div>
  );
}
