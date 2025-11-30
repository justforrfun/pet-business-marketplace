"use client";
import { ChangeEvent, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff } from "lucide-react";
import { FormCard } from "./FormCard";
import { Submit } from "./Submit";
import { LoginSchema } from "@/schemas/auth";
import { useFormValidate } from "@/hooks/useFormValidate";
import { TLoginFormError } from "@/types/form";
import { FormMessage } from "./FormMessage";
import toast from "react-hot-toast";
import Link from "next/link";

export function LoginForm() {
  const { errors, validateField } =
    useFormValidate<TLoginFormError>(LoginSchema);

  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  // 필드 유효성 검사
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    validateField(id, value);

    if (id === "login_id") setLoginId(value);
    if (id === "password") setPassword(value);
  };

  // 로그인 처리 함수
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 필수 입력 확인
    if (!loginId.trim()) {
      toast.error("아이디를 입력해 주세요.");
      return;
    }

    if (!password.trim()) {
      toast.error("비밀번호를 입력해 주세요.");
      return;
    }

    // 유효성 에러가 있는 경우
    if (Object.keys(errors).length > 0) {
      toast.error(
        "존재하는 계정이 없습니다. 아이디와 비밀번호를 다시 확인해주세요."
      );
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_id: loginId,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(
          data.error || "로그인 중 오류가 발생했습니다. 다시 시도해 주세요."
        );
        return;
      }

      // 로그인 성공
      window.location.href = "/"; // 메인페이지로 이동
    } catch (err) {
      console.error("로그인 요청 실패:", err);
      toast.error("로그인중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <FormCard
      title="로그인"
      footer={
        <div className="flex items-center justify-center gap-2 text-sm">
          <Link
            href="/find-id"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            아이디 찾기
          </Link>
          <span className="text-muted-foreground/50">|</span>
          <Link
            href="/find-password"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            비밀번호 찾기
          </Link>
          <span className="text-muted-foreground/50">|</span>
          <Link
            href="/signup"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            회원가입
          </Link>
        </div>
      }
    >
      {/* onSubmit 연결 */}
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {/* 이메일 */}
        <div className="grid gap-2">
          <Label htmlFor="login_id" className="font-bold">
            이메일
          </Label>
          <Input
            id="login_id"
            type="email"
            placeholder="mail@email.com"
            required
            value={loginId}
            onChange={handleChange}
          />
          {errors?.login_id && <FormMessage message={errors.login_id[0]} />}
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
              value={password}
              onChange={handleChange}
              className="pr-10"
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

        {/* 아이디 저장하기 */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <label className="flex items-center space-x-2">
            <input type="checkbox" />
            <span>아이디 저장하기</span>
          </label>
        </div>

        {/* 로그인 버튼 */}
        <div className="pt-6">
          <Submit className="w-full">로그인</Submit>
        </div>
      </form>
    </FormCard>
  );
}
