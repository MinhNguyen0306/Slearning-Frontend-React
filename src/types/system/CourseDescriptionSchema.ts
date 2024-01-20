import { z } from "zod";

export const courseDescriptionSchema = z.object({
    description: z.string().min(5, { message: "Nhap it nhat 5 ky tu" }) 
})

export type CourseDescriptionSchema = z.infer<typeof courseDescriptionSchema>