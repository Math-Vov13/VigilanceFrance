import { z } from "zod";

export const solvedVoteDB = z.object({
    id: z.string(),
    user_id: z.string(),
    issue_id: z.string(),

    date: z.date()
})