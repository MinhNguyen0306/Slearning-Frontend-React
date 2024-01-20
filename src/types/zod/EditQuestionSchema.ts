import { z } from 'zod'

export const editQuestionSchema = z.object({
    question: z
        .string()
        .min(1, "Nhap it nhat 1 ky tu")
        .or(z
            .number()
            .min(1, "Nhap it nhat 1 ky tu")
        )
        .transform(String)
})

export type EditQuestionSchema = z.infer<typeof editQuestionSchema>