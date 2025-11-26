import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

type FindIdBody = {
  nickname?: string;
};

const maskEmail = (email: string) => {
  if (!email.includes("@")) return email;

  const [idPart, domain] = email.split("@");
  if (!idPart) return email;

  if (idPart.length === 1) {
    return `*@${domain}`;
  }

  const masked =
    idPart.length <= 2
      ? idPart[0] + "*".repeat(idPart.length - 1)
      : idPart.slice(0, 2) + "*".repeat(idPart.length - 2);

  return `${masked}@${domain}`;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as FindIdBody;

    const nickname = body?.nickname?.trim();

    if (!nickname) {
      return NextResponse.json(
        {
          success: false,
          errorType: "VALIDATION",
          error: "닉네임을 입력해 주세요.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("member")
      .select("login_id")
      .eq("nickname", nickname)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("아이디 찾기 오류:", error);
      return NextResponse.json(
        {
          success: false,
          errorType: "SERVER",
          error: "아이디 찾기 중 오류가 발생했습니다.",
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          success: true,
          found: false,
        },
        { status: 200 }
      );
    }

    const maskedLoginId = maskEmail(data.login_id);

    return NextResponse.json(
      {
        success: true,
        found: true,
        login_id: maskedLoginId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("서버 오류:", error);
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
