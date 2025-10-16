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
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    validateField(id, value);
  };

  //console.log("errors", errors);
  return (
    <FormCard title="회원가입" description="모든 정보는 필수 입력사항입니다.">
      <form className="flex flex-col gap-6">
        {/* 이메일 */}
        <div className="grid gap-2">
          <Label htmlFor="email" className="font-bold">
            이메일
          </Label>
          <div className="flex gap-2">
            <Input
              id="email"
              type="email"
              placeholder="mail@email.com"
              required
              onChange={handleChange}
            />
            <Button variant="secondary" type="button">
              중복 확인
            </Button>
          </div>
          {errors?.email && <FormMessage message={errors.email[0]} />}
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

            {/* 눈 아이콘 토글 */}
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
              placeholder="2~12자리 / 한국, 영문 대소문자, 숫자 가능"
              required
              onChange={handleChange}
            />
            <Button variant="secondary" type="button">
              중복 확인
            </Button>
          </div>
          {errors?.nickname && <FormMessage message={errors.nickname[0]} />}
        </div>
        <div className="pt-6">
          <Submit className="w-full">가입하기</Submit>
        </div>
      </form>
    </FormCard>
  );
}
