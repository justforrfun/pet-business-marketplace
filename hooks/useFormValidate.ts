import { useState } from "react";
import { ZodObject, ZodRawShape } from "zod";

export function useFormValidate<T>(schema:ZodObject<ZodRawShape>) {
    const [errors, setErrors] = useState<Partial<T>>();

    const validateField = (id: string, value:string) => {
        setErrors({
            ...errors,
            [id]: undefined,
        });
        const parsedValue = schema.pick({[id]:true}).safeParse({
            [id]:value,

        });
        
        if(!parsedValue.success) {
            setErrors({
                ...errors,
                ...parsedValue.error.flatten().fieldErrors
            })
        }
    };
    return {errors, validateField};

}