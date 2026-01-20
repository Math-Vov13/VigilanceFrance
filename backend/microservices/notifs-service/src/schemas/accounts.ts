import { z } from "zod";

export const UserPub = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    address: z.string(),
    created_at: z.string(),
});