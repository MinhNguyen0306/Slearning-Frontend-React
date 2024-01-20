import { z } from "zod";

export const courseIntroduceSchema = z.object({
    introduce: z.string().min(5, { message: "Nhap it nhat 5 ky tu" }) 
})

export type CourseIntroduceSchema = z.infer<typeof courseIntroduceSchema>