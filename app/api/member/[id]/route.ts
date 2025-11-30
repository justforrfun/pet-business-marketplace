import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const memberId = parseInt(params.id, 10);

    if (isNaN(memberId)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 회원 ID입니다.' },
        { status: 400 }
      );
    }

    // 회원 삭제
    const { error } = await supabase
      .from('member')
      .delete()
      .eq('id', memberId);

    if (error) {
      console.error('회원 삭제 오류:', error);
      return NextResponse.json(
        { success: false, error: '회원 탈퇴 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '회원 탈퇴가 완료되었습니다.',
    });
  } catch (error) {
    console.error('회원 탈퇴 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
