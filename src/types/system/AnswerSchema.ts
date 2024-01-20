import { z } from 'zod'

export const answerSchema = z.object({
    answer: z
        .string()
        .min(1, "Nhap it nhat 1 ky tu")
        .or(z
            .number()
            .min(1, "Nhap it nhat 1 ky tu")
        )
        .transform(String)
})

export type AnswerSchema = z.infer<typeof answerSchema>