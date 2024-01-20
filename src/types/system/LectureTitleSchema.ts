import { z } from "zod";

export const lectureTitleSchema = z.object({
    title: z.string().min(5, { message: "Nhap it nhat 5 ky tu" }) 
})

export type LectureTitleSchema = z.infer<typeof lectureTitleSchema>