//hooks/useFormValidate.ts
import { useState } from "react";
import { ZodObject, ZodRawShape } from "zod";

export function useFormValidate<T>(schema: ZodObject<ZodRawShape>) {
    const [errors, setErrors] = useState<Partial<T>>({});

    const validateField = (id: string, value: string) => {
        // 함수형 업데이트로 최신 상태 참조
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors[id as keyof T];

            const parsedValue = schema.pick({ [id]: true }).safeParse({
                [id]: value,
            });

            if (!parsedValue.success) {
                const fieldErrors = parsedValue.error.flatten().fieldErrors;
                return {
                    ...newErrors,
                    ...fieldErrors
                };
            }

            return newErrors;
        });
    };

    const clearErrors = () => setErrors({});

    return { errors, validateField, clearErrors };
}