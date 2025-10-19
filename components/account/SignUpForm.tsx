"use client";

import { ChangeEvent, use, useEffect, useState } from "react";
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
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function SignUpForm() {
  const { errors, validateField } =
    useFormValidate<TSignUpFormError>(SignUpSchema);

  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 필드 유효성 검사
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    validateField(id, value);

    if (id === "login_id") {
      setLoginId(value);
      setEmailCheck(null);
    }
    if (id === "password") {
      setPassword(value);
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

  //  회원가입 처리 함수
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;

    // 필수 입력 확인
    if (!loginId.trim() || !passwordInput?.value.trim() || !nickname.trim()) {
      toast.error("모든 항목을 입력해주세요.");
      return;
    }

    // 유효성 에러가 있는 경우
    if (Object.keys(errors).length > 0) {
      toast.error(
        "입력하신 내용에 오류가 발견되었습니다. 에러 메시지를 확인해 주세요."
      );
      return;
    }

    // 이메일 중복 확인 여부 체크
    if (!emailCheck || emailCheck.color !== "text-green-600") {
      toast.error("이메일 중복 확인을 해주세요.");
      return;
    }

    // 닉네임 중복 확인 여부 체크
    if (!nickCheck || nickCheck.color !== "text-green-600") {
      toast.error("닉네임 중복 확인을 해주세요.");
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
        toast.error(
          data.error || "회원가입 중 오류가 발생했습니다. 다시 시도해 주세요."
        );
        return;
      }

      // 회원가입 성공 시 모달 표시
      setIsModalOpen(true);
    } catch (err) {
      console.error("회원가입 요청 실패:", err);
      toast.error("회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <>
      <FormCard title="회원가입" description="모든 정보는 필수 입력사항입니다.">
        {/* onSubmit 연결 */}
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
            {errors?.login_id && <FormMessage message={errors.login_id[0]} />}
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
                value={password}
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
                value={nickname}
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

      {/* ✅ FormCard 아래에 Dialog 모달 배치 */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle>회원가입 완료 🎉</DialogTitle>
            <DialogDescription>
              회원가입이 성공적으로 완료되었습니다. 로그인 후 이용해주세요.
            </DialogDescription>
          </DialogHeader>
          <Button
            className="w-full"
            onClick={() => (window.location.href = "/login")}
          >
            로그인하러 가기
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
