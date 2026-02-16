import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { LoginSchema } from "@/schemas/auth";
import { addPointAndUpdateGrade } from "@/lib/pointUtils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Zod 스키마 유효성 검사
    const validated = LoginSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "입력값을 확인해 주세요." },
        { status: 400 }
      );
    }

    const { login_id, password } = validated.data;

    // 2. 사용자 조회
    const { data: user, error } = await supabase
      .from("member")
      .select("id, login_id, password, nickname, status")
      .eq("login_id", login_id)
      .single();

    if (error) throw error;
    if (!user)
      return NextResponse.json(
        { success: false, error: "존재하는 계정이 없습니다." },
        { status: 404 }
      );

    // 3. 비밀번호 확인 
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, error: "비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }

    // 4. 포인트 적립 (로그인 +10)
    await addPointAndUpdateGrade(user.id, 10);

    // 5. 최신 포인트·등급 조회
    const { data: updated } = await supabase
      .from("member")
      .select("point, grade:grade_id(id, name, category)")
      .eq("id", user.id)
      .single();

    // 6. 로그인 성공
    return NextResponse.json({
      success: true,
      message: "로그인 성공",
      data: {
        id: user.id,
        loginId: user.login_id,
        nickname: user.nickname,
        status: user.status,
        point: updated?.point ?? 0,
        grade: updated?.grade ?? null,
      },
    });
  } catch (error) {
    console.error("로그인 오류:", error);
    return NextResponse.json(
      { success: false, error: "로그인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}