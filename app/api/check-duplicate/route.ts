import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    const { type, value } = await request.json();

    if (!type || !value) {
      return NextResponse.json(
        { success: false, error: "필수 파라미터가 누락되었습니다." },
        { status: 400 }
      );
    }

    // member 테이블에서 type에 따라 조회
    let query = supabase.from("member").select("id");

    if (type === "email") {
      query = query.eq("login_id", value);
    } else if (type === "nickname") {
      query = query.eq("nickname", value);
    } else {
      return NextResponse.json(
        { success: false, error: "잘못된 타입입니다." },
        { status: 400 }
      );
    }

    const { data, error } = await query.single();

    // PGRST116: "No rows found" → 중복 아님
    if (error && error.code !== "PGRST116") {
      console.error("중복 확인 오류:", error);
      return NextResponse.json(
        { success: false, error: "중복 확인 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    const isDuplicate = !!data;

    return NextResponse.json({
      success: true,
      isDuplicate,
      message: isDuplicate
        ? `이미 사용 중인 ${type === "email" ? "이메일" : "닉네임"}입니다.`
        : `사용 가능한 ${type === "email" ? "이메일" : "닉네임"}입니다.`,
    });
  } catch (error) {
    console.error("서버 오류:", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
