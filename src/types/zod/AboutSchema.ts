import {z} from 'zod';

export const aboutSchema = z.object({
    about: z
        .string()
        .min(1, "Gioi thieu it nhat 1 ky tu")
        .max(1000, "Gioi thieu nhieu nhat 1000 ky tu")
})

export type AboutSchema = z.infer<typeof aboutSchema>;