import {z} from 'zod';

export const categorySchema = z.object({
    category: z
        .string()
        .min(5, "Nhập ít nhất 5 ký tự")
        .max(50, "Nhập nhiều nhất 50 ký tự")
})

export type CategorySchema = z.infer<typeof categorySchema>;