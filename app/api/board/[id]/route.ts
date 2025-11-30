import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// 게시글 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: '잘못된 게시글 ID입니다.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('board')
      .select('id, title, content, created_at, member_id, member(nickname)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: '게시글을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
      console.error('게시글 조회 오류:', error);
      return NextResponse.json(
        { success: false, error: '게시글 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    const date = new Date(data.created_at);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}.${month}.${day}`;

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        title: data.title,
        content: data.content,
        author: data.member?.nickname || '알 수 없음',
        date: formattedDate,
        created_at: data.created_at,
        member_id: data.member_id,
      },
    });
  } catch (error) {
    console.error('서버 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 게시글 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const body = await request.json();
    const { title, content, memberId } = body;

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: '잘못된 게시글 ID입니다.' },
        { status: 400 }
      );
    }

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: '제목을 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: '내용을 입력해주세요.' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const finalMemberId = memberId || 1; // TODO: 실제 로그인된 사용자 ID 사용

    const { data, error } = await supabase
      .from('board')
      .update({
        title: title.trim(),
        content: content.trim(),
        updated_at: now,
        updated_by: finalMemberId,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('게시글 수정 오류:', error);
      return NextResponse.json(
        { success: false, error: '게시글 수정 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: '게시글이 수정되었습니다.',
    });
  } catch (error) {
    console.error('서버 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 게시글 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: '잘못된 게시글 ID입니다.' },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('board').delete().eq('id', id);

    if (error) {
      console.error('게시글 삭제 오류:', error);
      return NextResponse.json(
        { success: false, error: '게시글 삭제 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '게시글이 삭제되었습니다.',
    });
  } catch (error) {
    console.error('서버 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

