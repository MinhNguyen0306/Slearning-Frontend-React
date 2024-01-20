import { z } from "zod";

export const lectureSchema = z.object({
    title: z.string().min(5, "Nhap it nhat 5 ky tu") ,
    description: z.string().min(10, "Nhap it nhat 10 ky tu")
})

export type LectureSchema = z.infer<typeof lectureSchema>