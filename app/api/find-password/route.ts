import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

type FindPasswordBody = {
  login_id?: string;
  nickname?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as FindPasswordBody;

    const email = body?.login_id?.trim();
    const nickname = body?.nickname?.trim();

    // 입력값 검증
    if (!email || !nickname) {
      return NextResponse.json(
        {
          success: false,
          errorType: "VALIDATION",
          error: "이메일과 닉네임을 모두 입력해 주세요.",
        },
        { status: 400 }
      );
    }

    // DB 조회
    const { data, error } = await supabase
      .from("member")
      .select("id")
      .eq("login_id", email)
      .eq("nickname", nickname)
      .single();

    // 예상치 못한 supabase 에러
    if (error && error.code !== "PGRST116") {
      console.error("비밀번호 찾기 오류:", error);
      return NextResponse.json(
        {
          success: false,
          errorType: "SERVER",
          error: "비밀번호 찾기 중 오류가 발생했습니다.",
        },
        { status: 500 }
      );
    }

    // 일치하는 회원 없음
    if (!data) {
      return NextResponse.json(
        {
          success: true,
          verified: false,
        },
        { status: 200 }
      );
    }

    // 회원 확인됨
    return NextResponse.json(
      {
        success: true,
        verified: true,
        userId: data.id,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("서버 오류:", err);
    return NextResponse.json(
      {
        success: false,
        errorType: "UNEXPECTED",
        error: "서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
