import { z } from "zod";

export const lectureDescriptionSchema = z.object({
    description: z.string().min(5, { message: "Nhap it nhat 5 ky tu" }) 
})

export type LectureDescriptionSchema = z.infer<typeof lectureDescriptionSchema>