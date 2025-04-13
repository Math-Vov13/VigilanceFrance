import { z } from "zod";

export const voteDB = z.object({
    id: z.string(),
    user_id: z.string(),
    issue_id: z.string(),

    date: z.date()
})