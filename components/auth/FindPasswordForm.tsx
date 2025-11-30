"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormCard } from "@/components/auth/FormCard";
import { Submit } from "@/components/auth/Submit";
import { FormMessage } from "@/components/auth/FormMessage";
import { useFormValidate } from "@/hooks/useFormValidate";
import { FindPasswordSchema } from "@/schemas/auth";
import { TFindPasswordFormError } from "@/types/form";
import { PasswordFindResultModal } from "@/components/auth/PasswordFindModal";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import Link from "next/link";

export function FindPasswordForm() {
  const { errors, validateField } =
    useFormValidate<TFindPasswordFormError>(FindPasswordSchema);

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // API 결과 저장
  const [userId, setUserId] = useState<number | null>(null);

  // 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [serverError, setServerError] = useState<{
    type: string | null;
    message: string | null;
  } | null>(null);

  // 2단계 이동 여부
  const [step, setStep] = useState<1 | 2>(1);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateField("login_id", e.target.value);
    setEmail(e.target.value);
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateField("nickname", e.target.value);
    setNickname(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedNickname = nickname.trim();

    if (!trimmedEmail || !trimmedNickname) {
      validateField("login_id", trimmedEmail);
      validateField("nickname", trimmedNickname);
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/find-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_id: trimmedEmail,
          nickname: trimmedNickname,
        }),
      });

      let data;

      try {
        data = await res.json();
      } catch {
        setServerError({ type: "UNEXPECTED", message: null });
        setModalOpen(true);
        return;
      }

      if (!data.success) {
        setServerError({
          type: data.errorType || "UNEXPECTED",
          message: data.error,
        });
        setModalOpen(true);
        return;
      }

      if (!data.verified) {
        setUserId(null);
        setModalOpen(true);
      } else {
        setUserId(data.userId);
        setStep(2); // ResetPasswordForm으로 이동!
      }
    } catch {
      setServerError({ type: "NETWORK", message: null });
      setModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2단계 이동 시 ResetPasswordForm 렌더링
  if (step === 2 && userId) {
    return <ResetPasswordForm userId={userId} />;
  }

  return (
    <>
      <FormCard
        title="비밀번호 찾기"
        description="회원가입 시 입력한 정보를 입력해주세요"
        footer={
          <div className="flex items-center justify-center gap-2 text-sm">
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              로그인
            </Link>
            <span className="text-muted-foreground/50">|</span>
            <Link
              href="/find-id"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              아이디 찾기
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
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* 이메일 */}
          <div className="grid gap-2">
            <Label htmlFor="email" className="font-bold">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력해 주세요."
              value={email}
              onChange={handleEmailChange}
            />
            {errors?.login_id && <FormMessage message={errors.login_id[0]} />}
          </div>

          {/* 닉네임 */}
          <div className="grid gap-2">
            <Label htmlFor="nickname" className="font-bold">
              닉네임
            </Label>
            <Input
              id="nickname"
              type="text"
              placeholder="닉네임을 입력해 주세요."
              value={nickname}
              onChange={handleNicknameChange}
            />
            {errors?.nickname && <FormMessage message={errors.nickname[0]} />}
          </div>

          <div className="pt-6">
            <Submit className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "조회중..." : "비밀번호 찾기"}
            </Submit>
          </div>
        </form>
      </FormCard>

      {/* 검색 결과 모달 */}
      <PasswordFindResultModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        serverError={serverError}
      />
    </>
  );
}
