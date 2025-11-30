import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const showMyPosts = searchParams.get('showMyPosts') === 'true';
    const memberId = searchParams.get('memberId');

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // 기본 쿼리: board와 member join
    let query = supabase
      .from('board')
      .select('id, title, created_at, member_id, member(nickname)', {
        count: 'exact',
      })
      .order('created_at', { ascending: false })
      .range(from, to);

    // 내 글 보기 필터
    if (showMyPosts && memberId) {
      query = query.eq('member_id', memberId);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('게시판 조회 오류:', error);
      return NextResponse.json(
        { success: false, error: '게시판 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 데이터 변환: member join 결과 처리
    const posts = (data || []).map((post: any) => {
      const date = new Date(post.created_at);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}.${month}.${day}`;

      return {
        id: post.id,
        title: post.title,
        author: post.member?.nickname || '알 수 없음',
        date: formattedDate,
        created_at: post.created_at,
      };
    });

    const totalPages = count ? Math.ceil(count / limit) : 1;

    return NextResponse.json({
      success: true,
      data: {
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount: count || 0,
          limit,
        },
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

