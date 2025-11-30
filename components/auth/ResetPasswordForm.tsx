"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormCard } from "@/components/auth/FormCard";
import { Submit } from "@/components/auth/Submit";
import { FormMessage } from "@/components/auth/FormMessage";
import { useFormValidate } from "@/hooks/useFormValidate";
import { ResetPasswordSchema } from "@/schemas/auth";
import { TResetPasswordFormError } from "@/types/form";
import { PasswordResetModal } from "@/components/auth/PasswordResetModal";

interface ResetPasswordFormProps {
  userId: number;
}

export function ResetPasswordForm({ userId }: ResetPasswordFormProps) {
  // ★ 중요: useFormValidate에서 setErrors를 꺼내옴 (이전 코드의 setFormErrors 대신 사용)
  const { errors, validateField, setErrors, clearErrors } =
    useFormValidate<TResetPasswordFormError>(ResetPasswordSchema);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [serverError, setServerError] = useState<{
    type: string | null;
    message: string | null;
  } | null>(null);
  const [success, setSuccess] = useState(false);

  // 새 비밀번호 입력 (입력 시 실시간 유효성 검사)
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    validateField("newPassword", value);
  };

  // 새 비밀번호 확인 입력 (입력 시 실시간 유효성 검사)
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    validateField("confirmPassword", value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedNewPassword = newPassword.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    // 데이터 객체 생성
    const formData = {
      newPassword: trimmedNewPassword,
      confirmPassword: trimmedConfirmPassword,
    };

    // 1) 전체 스키마 검증 (빈칸, 정규식, 그리고 불일치 여부까지 모두 검사)
    const parsed = ResetPasswordSchema.safeParse(formData);

    if (!parsed.success) {
      // 검증 실패 시 Hook의 에러 상태를 강제로 업데이트
      setErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    // 2) 검증 통과 후 서버 요청 시작
    clearErrors();
    setIsSubmitting(true);
    setServerError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          newPassword: trimmedNewPassword,
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

      setSuccess(true);
      setModalOpen(true);
    } catch {
      setServerError({ type: "NETWORK", message: null });
      setModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <FormCard
        title="비밀번호 재설정"
        description="새로운 비밀번호를 입력해 주세요."
      >
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* 새 비밀번호 */}
          <div className="grid gap-2">
            <Label htmlFor="newPassword" className="font-bold">
              새 비밀번호
            </Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="새 비밀번호를 입력해 주세요."
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
            />
            {errors?.newPassword && (
              <FormMessage message={errors.newPassword[0]} />
            )}
          </div>

          {/* 새 비밀번호 확인 */}
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword" className="font-bold">
              새 비밀번호 확인
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="새 비밀번호를 다시 입력해 주세요."
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            {errors?.confirmPassword && (
              <FormMessage message={errors.confirmPassword[0]} />
            )}
          </div>

          <div className="pt-6">
            <Submit className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "변경중..." : "비밀번호 변경하기"}
            </Submit>
          </div>
        </form>
      </FormCard>

      <PasswordResetModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        serverError={serverError}
        success={success}
      />
    </>
  );
}
