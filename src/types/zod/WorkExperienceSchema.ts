import {z} from 'zod';

export const workExperienceSchema = z.object({
    company: z
        .string()
        .min(5, "It nhat 5 ky tu")
        .max(30, "Nhieu nhat 30 ky tu"),
    position: z
        .string()
        .min(1, "It nhat 5 ky tu")
        .max(30, "Nhieu nhat 30 ky tu"),
    description: z
        .string()
        // .min(15, "It nhat 5 ky tu")
        .max(100, "Nhieu nhat 100 ky tu"),
})

export type WorkExperienceSchema = z.infer<typeof workExperienceSchema>;