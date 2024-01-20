import { z } from 'zod';

export const reminderSchema = z.object({
    summary: z
        .string()
        .min(1, "Nhap it nhat 1 ky tu")
})

export type ReminderSchema = z.infer<typeof reminderSchema>