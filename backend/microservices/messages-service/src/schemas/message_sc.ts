import z from "zod";


export const message = z.object({
    user_id: z.string(),
    message: z.string().min(1).max(500),
    created_at: z.date(),
})

export const createMessage = z.object({
    message: z.string().min(1).max(500),
    date: z.string()
})