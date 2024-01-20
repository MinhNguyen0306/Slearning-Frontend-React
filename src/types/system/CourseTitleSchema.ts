import { z } from "zod";

export const courseTitleSchema = z.object({
    title: z.string().min(5, { message: "Nhap it nhat 5 ky tu" }) 
})

export type CourseTitleSchema = z.infer<typeof courseTitleSchema>