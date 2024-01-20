import { z } from "zod";

export const courseRequirementSchema = z.object({
    requirement: z.string().min(5, { message: "Nhap it nhat 5 ky tu" }) 
})

export type CourseRequirementSchema = z.infer<typeof courseRequirementSchema>