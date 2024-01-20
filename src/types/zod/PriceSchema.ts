import { z } from 'zod';

export const priceSchema = z.object({
    price: z.coerce
        .number()
        .max(5000000, "Gia toi da 5000000")
})

export type PriceSchema = z.infer<typeof priceSchema>