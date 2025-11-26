"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormCard } from "@/components/auth/FormCard";
import { Submit } from "@/components/auth/Submit";
import { FormMessage } from "@/components/auth/FormMessage";
import { useFormValidate } from "@/hooks/useFormValidate";
import { FindIdSchema } from "@/schemas/auth";
import { TFindIdFormError } from "@/types/form";
import { ResultModal } from "@/components/auth/ResultModal";

type FindIdResponse =
  | {
      success: true;
      found: boolean;
      login_id?: string;
    }
  | {
      success: false;
      error: string;
      errorType?: string;
    };

export function FindIdForm() {
  const { errors, validateField } =
    useFormValidate<TFindIdFormError>(FindIdSchema);

  const [nickname, setNickname] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [foundLoginId, setFoundLoginId] = useState<string | null>(null);
  const [isFound, setIsFound] = useState(false);
  const [serverError, setServerError] = useState<{
    type: string | null;
    message: string | null;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateField("nickname", e.target.value);
    setNickname(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      validateField("nickname", trimmedNickname);
      return;
    }

    setIsSubmitting(true);
    setServerError(null);
    setIsFound(false);
    setFoundLoginId(null);

    try {
      const res = await fetch("/api/find-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: trimmedNickname }),
      });

      let data: FindIdResponse;

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

      if (!data.found) {
        setIsFound(false);
        setFoundLoginId(null);
      } else {
        setIsFound(true);
        setFoundLoginId(data.login_id ?? null);
      }

      setModalOpen(true);
    } catch (err) {
      setServerError({ type: "NETWORK", message: null });
      setModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <FormCard
        title="아이디 찾기"
        description="가입 시 입력하신 닉네임으로 아이디를 찾을 수 있습니다."
      >
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="nickname" className="font-bold">
              닉네임
            </Label>
            <Input
              id="nickname"
              type="text"
              placeholder="닉네임을 입력해 주세요."
              value={nickname}
              onChange={handleChange}
              required
            />

            {errors?.nickname && <FormMessage message={errors.nickname[0]} />}
          </div>

          <div className="pt-6">
            <Submit className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "조회중..." : "아이디 찾기"}
            </Submit>
          </div>
        </form>
      </FormCard>

      <ResultModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        nickname={nickname}
        loginId={foundLoginId}
        isFound={isFound}
        serverError={serverError}
      />
    </>
  );
}
