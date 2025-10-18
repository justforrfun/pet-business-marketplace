"use client";

import { ChangeEvent, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff } from "lucide-react";
import { FormCard } from "./FormCard";
import { Submit } from "./Submit";
import { SignUpSchema } from "@/schemas/account";
import { useFormValidate } from "@/hooks/useFormValidate";
import { TSignUpFormError } from "@/types/form";
import { FormMessage } from "./FormMessage";

export function SignUpForm() {
  const { errors, validateField } =
    useFormValidate<TSignUpFormError>(SignUpSchema);

  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [nickname, setNickname] = useState("");

  // 이메일 / 닉네임 각각 메시지 상태
  const [emailCheck, setEmailCheck] = useState<{
    message: string;
    color: string;
  } | null>(null);
  const [nickCheck, setNickCheck] = useState<{
    message: string;
    color: string;
  } | null>(null);

  // 필드 유효성 검사
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    validateField(id, value);

    if (id === "login_id") {
      setLoginId(value);
      setEmailCheck(null);
    }
    if (id === "nickname") {
      setNickname(value);
      setNickCheck(null);
    }
  };

  // 중복 확인
  const handleDuplicateCheck = async (
    type: "email" | "nickname",
    value: string
  ) => {
    try {
      const res = await fetch("/api/check-duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, value }),
      });
      const result = await res.json();

      const isAvailable = result.success && !result.isDuplicate;
      const msg = {
        message: result.message,
        color: isAvailable ? "text-green-600" : "text-red-600",
      };

      if (type === "email") setEmailCheck(msg);
      else setNickCheck(msg);
    } catch (err) {
      const msg = {
        message: "요청 중 오류가 발생했습니다.",
        color: "text-red-600",
      };
      if (type === "email") setEmailCheck(msg);
      else setNickCheck(msg);
    }
  };

  // ✅ 회원가입 처리 함수
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;

    // 필수 입력 확인
    if (!loginId.trim() || !passwordInput?.value.trim() || !nickname.trim()) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    // 유효성 에러가 있는 경우 중단
    if (Object.keys(errors).length > 0) {
      alert("입력값을 다시 확인해주세요.");
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_id: loginId,
          password: passwordInput.value,
          nickname,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "회원가입에 실패했습니다.");
        return;
      }

      alert("회원가입이 완료되었습니다!");
      window.location.href = "/login"; // ✅ 로그인 페이지로 이동
    } catch (err) {
      console.error("회원가입 요청 실패:", err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <FormCard title="회원가입" description="모든 정보는 필수 입력사항입니다.">
      {/* ✅ onSubmit 연결 */}
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {/* 이메일 */}
        <div className="grid gap-2">
          <Label htmlFor="login_id" className="font-bold">
            이메일
          </Label>
          <div className="flex gap-2">
            <Input
              id="login_id"
              type="email"
              placeholder="mail@email.com"
              required
              onChange={handleChange}
            />
            <Button
              variant="secondary"
              type="button"
              disabled={!!errors?.login_id || !loginId.trim()} // 유효하지 않으면 비활성화
              onClick={() => handleDuplicateCheck("email", loginId)}
            >
              중복 확인
            </Button>
          </div>
          {/* Zod 에러 */}
          {errors?.login_id && <FormMessage message={errors.login_id[0]} />}
          {/* 중복확인 결과 */}
          {emailCheck && (
            <p className={`text-sm ml-1 mt-1 ${emailCheck.color}`}>
              {emailCheck.message}
            </p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="grid gap-2">
          <Label htmlFor="password" className="font-bold">
            비밀번호
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="8~16자리 / 영문 대소문자, 숫자, 특수문자 조합"
              required
              className="pr-10"
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors?.password && <FormMessage message={errors.password[0]} />}
        </div>

        {/* 닉네임 */}
        <div className="grid gap-2">
          <Label htmlFor="nickname" className="font-bold">
            닉네임
          </Label>
          <div className="flex gap-2">
            <Input
              id="nickname"
              type="text"
              placeholder="2~12자리 / 한글, 영문 대소문자, 숫자 가능"
              required
              onChange={handleChange}
            />
            <Button
              variant="secondary"
              type="button"
              disabled={!!errors?.nickname || !nickname.trim()} // 유효하지 않으면 비활성화
              onClick={() => handleDuplicateCheck("nickname", nickname)}
            >
              중복 확인
            </Button>
          </div>
          {errors?.nickname && <FormMessage message={errors.nickname[0]} />}
          {nickCheck && (
            <p className={`text-sm ml-1 mt-1 ${nickCheck.color}`}>
              {nickCheck.message}
            </p>
          )}
        </div>

        <div className="pt-6">
          <Submit className="w-full">가입하기</Submit>
        </div>
      </form>
    </FormCard>
  );
}
