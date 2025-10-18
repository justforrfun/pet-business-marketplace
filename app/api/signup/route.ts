import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { SignUpSchema } from '@/schemas/account';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 1. Zod 스키마로 유효성 검사
    const validatedData = SignUpSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: '유효성 검사 실패',
          details: validatedData.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const { login_id, password, nickname } = validatedData.data;

    // 2. 이메일 중복 확인
    const { data: existingEmail } = await supabase
      .from('member')
      .select('login_id')
      .eq('login_id', login_id)
      .single();

    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: '이미 사용 중인 이메일입니다.' },
        { status: 409 }
      );
    }

    // 3. 닉네임 중복 확인
    const { data: existingNickname } = await supabase
      .from('member')
      .select('nickname')
      .eq('nickname', nickname)
      .single();

    if (existingNickname) {
      return NextResponse.json(
        { success: false, error: '이미 사용 중인 닉네임입니다.' },
        { status: 409 }
      );
    }

    // 4. 비밀번호 암호화
    // const hashedPassword = await bcrypt.hash(password, 10);

    // 5. 회원 정보 저장
    const { data, error } = await supabase
      .from('member')
      .insert([
        {
          login_id: login_id,
          password: password,
          nickname: nickname,
          status: 'ACTIVE'
        }
      ])
      .select();

    if (error) {
      console.error('DB 저장 실패:', error);
      return NextResponse.json(
        { success: false, error: '회원가입 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      data: {
        id: data[0].id,
        email: data[0].login_id,
        nickname: data[0].nickname
      }
    });

  } catch (error) {
    console.error('회원가입 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}