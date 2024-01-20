import { z } from "zod";

export const courseAchievementSchema = z.object({
    achievement: z.string().min(5, { message: "Nhap it nhat 5 ky tu" }) 
})

export type CourseAchievementSchema = z.infer<typeof courseAchievementSchema>