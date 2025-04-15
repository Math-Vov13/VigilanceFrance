import z from "zod";


export const message = z.object({
    user_id: z.string(),
    message: z.string().min(15).max(200),
    created_at: z.date(),
})

export const createMessage = z.object({
    message: z.string().min(15).max(200),
    date: z.date()
})