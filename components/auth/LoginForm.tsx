"use client";

import { ChangeEvent, useEffect, useState } from "react";
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

  // 아이디 저장 체크박스
  const [saveId, setSaveId] = useState(false);

  // 로그인 화면 진입 시 saved_login_id 가져오기
  useEffect(() => {
    const saved = localStorage.getItem("saved_login_id");
    if (saved) {
      setLoginId(saved);
      setSaveId(true);
    }
  }, []);

  // 입력 처리
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    validateField(id, value);

    if (id === "login_id") setLoginId(value);
    if (id === "password") setPassword(value);
  };

  // 로그인 처리
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loginId.trim()) {
      toast.error("아이디를 입력해 주세요.");
      return;
    }

    if (!password.trim()) {
      toast.error("비밀번호를 입력해 주세요.");
      return;
    }

    if (Object.keys(errors).length > 0) {
      toast.error("아이디 혹은 비밀번호가 올바르지 않습니다.");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_id: loginId,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("로그인에 실패했어요.\n아이디 또는 비밀번호를 다시 확인해 주세요.");
        return;
      }

      // 로그인 성공 → 사용자 정보 저장
      if (data.success && data.data) {
        localStorage.setItem("user", JSON.stringify(data.data));
      }

      // ★ 아이디 저장하기 기능 반영
      if (saveId) {
        localStorage.setItem("saved_login_id", loginId);
      } else {
        localStorage.removeItem("saved_login_id");
      }

      toast.success(`${data.data.nickname}님 환영합니다!`);
      window.location.href = "/";
    } catch (err) {
      console.error("로그인 실패:", err);
      alert("로그인에 실패했어요.\n아이디 또는 비밀번호를 다시 확인해 주세요.");
    }
  };

  return (
    <FormCard
      title="로그인"
      footer={
        <div className="flex items-center justify-center gap-2 text-sm">
          <Link href="/find-id" className="hover:text-foreground">
            아이디 찾기
          </Link>
          <span>|</span>
          <Link href="/find-password" className="hover:text-foreground">
            비밀번호 찾기
          </Link>
          <span>|</span>
          <Link href="/signup" className="hover:text-foreground">
            회원가입
          </Link>
        </div>
      }
    >
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
              placeholder="8~16자리 / 영문 대소문자+숫자+특수문자"
              required
              value={password}
              onChange={handleChange}
              className="pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors?.password && <FormMessage message={errors.password[0]} />}
        </div>

        {/* 아이디 저장하기 */}
        <div className="flex items-center text-sm text-gray-600">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={saveId}
              onChange={() => setSaveId(!saveId)}
            />
            <span>아이디 저장하기</span>
          </label>
        </div>

        <div className="pt-6">
          <Submit className="w-full">로그인</Submit>
        </div>
      </form>
    </FormCard>
  );
}
