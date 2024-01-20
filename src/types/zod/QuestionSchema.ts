import { z } from 'zod';

export const questionSchema = z.object({
    question: z
        .string()
        .min(1, "Nhập ít nhất 1 ký tự")
        .or(z
            .number()
            .min(1, "Nhập ít nhất 1 ký tự")
        )
        .transform(String),
    answer1: z
        .string()
        .min(1, "Nhập câu trả lời 1")
        .or(z
            .number()
            .min(1, "Nhập câu trả lời 1")
        )
        .transform(String),
    answer2: z
        .string()
        // .min(1, "Nhập câu trả lời 2")
        .or(z
            .number()
            // .min(1, "Nhập câu trả lời 2")
        )
        .transform(String),
})

export type QuestionSchema = z.infer<typeof questionSchema>