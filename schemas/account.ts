
import { z } from "zod";

export const SignUpSchema = z.object({
  // 이메일
  email: z
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
