import { z } from "zod";

export const SignUpSchema = z.object({
  // 로그인 ID(이메일)
  login_id: z
    .string()
    .min(1, { message: "이메일을 입력해 주세요." })
    .email({ message: "유효한 이메일 주소를 입력해 주세요." }),

  // 비밀번호
  password: z
    .string()
    .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
    .max(16, { message: "비밀번호는 최대 16자 이하이어야 합니다." })
    .regex(/[A-Z]/, {
      message: "비밀번호는 최소 1개 이상의 대문자를 포함해야 합니다.",
    })
    .regex(/[a-z]/, {
      message: "비밀번호는 최소 1개 이상의 소문자를 포함해야 합니다.",
    })
    .regex(/[0-9]/, {
      message: "비밀번호는 최소 1개 이상의 숫자를 포함해야 합니다.",
    })
    .regex(/[\W_]/, {
      message: "비밀번호는 최소 1개 이상의 특수문자를 포함해야 합니다.",
    }),

  // 닉네임
  nickname: z
    .string()
    .min(2, { message: "닉네임은 2자 이상이어야 합니다." })
    .max(12, { message: "닉네임은 12자 이하이어야 합니다." })
    .regex(/^[가-힣a-zA-Z0-9]+$/, {
      message: "닉네임은 한글, 영문, 숫자만 사용할 수 있습니다.",
    }),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export const LoginSchema = z.object({
  // 로그인 ID(이메일)
  login_id: z
    .email({ message: "유효한 이메일 주소를 입력해 주세요." }),
  // 비밀번호
  password: z 
    .string()
    .min(1, {message:"비밀번호를 입력해 주세요." }),
}); 

export const FindIdSchema = z.object({
  nickname: z
    .string()
    .min(2, { message: "닉네임은 2자 이상이어야 합니다." })
    .max(12, { message: "닉네임은 12자 이하이어야 합니다." })
    .regex(/^[가-힣a-zA-Z0-9]+$/, {
      message: "닉네임은 한글, 영문, 숫자만 사용할 수 있습니다.",
    }),
});

export type FindIdSchemaType = z.infer<typeof FindIdSchema>;

export const FindPasswordSchema = z.object({
  login_id: z
    .string()
    .min(1, { message: "이메일을 입력해 주세요." })
    .email({ message: "유효한 이메일 주소를 입력해 주세요." }),

  nickname: z
    .string()
    .min(1, { message: "닉네임을 입력해 주세요." })        // ← 추가해야 함!!
    .min(2, { message: "닉네임은 2자 이상이어야 합니다." })
    .max(12, { message: "닉네임은 12자 이하이어야 합니다." })
    .regex(/^[가-힣a-zA-Z0-9]+$/, {
      message: "닉네임은 한글, 영문, 숫자만 사용할 수 있습니다.",
    }),
});

export type FindPasswordSchemaType = z.infer<typeof FindPasswordSchema>;

export const ResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, { message: "비밀번호를 입력해 주세요." })
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,16}$/,
        {
          message:
            "비밀번호는 8~16자, 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.",
        }
      ),

    confirmPassword: z
      .string()
      .min(1, { message: "비밀번호를 재입력해 주세요." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"], // 에러 메시지를 confirmPassword 필드 아래에 표시
    message: "비밀번호가 일치하지 않습니다.",
  });

export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
