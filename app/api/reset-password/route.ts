import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

type ResetPasswordBody = {
  userId?: number;
  newPassword?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ResetPasswordBody;

    const userId = body?.userId;
    const newPassword = body?.newPassword?.trim();

    // 입력값 검증
    if (!userId || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          errorType: "VALIDATION",
          error: "비밀번호를 입력해 주세요.",
        },
        { status: 400 }
      );
    }

    // DB 업데이트
    const { error } = await supabase
      .from("member")
      .update({ password: newPassword })
      .eq("id", userId);

    if (error) {
      console.error("비밀번호 변경 오류:", error);
      return NextResponse.json(
        {
          success: false,
          errorType: "SERVER",
          error: "비밀번호 변경 중 오류가 발생했습니다.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
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
