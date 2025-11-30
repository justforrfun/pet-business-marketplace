import { useState } from "react";
import { ZodObject, ZodRawShape } from "zod";

export function useFormValidate<T>(schema: ZodObject<ZodRawShape>) {
  const [errors, setErrors] = useState<Partial<T>>({});

  const validateField = (id: string, value: string) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[id as keyof T]; // 입력 시 해당 필드 에러 삭제

      // 해당 필드만 스키마 검증
      const parsedValue = schema.pick({ [id]: true }).safeParse({
        [id]: value,
      });

      if (!parsedValue.success) {
        const fieldErrors = parsedValue.error.flatten().fieldErrors;
        return {
          ...newErrors,
          ...fieldErrors,
        };
      }

      return newErrors;
    });
  };

  const clearErrors = () => setErrors({});
  
  return { errors, validateField, clearErrors, setErrors };
}