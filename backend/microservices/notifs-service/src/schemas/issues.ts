import { z } from "zod";

export const IssuePub = z.object({
    id: z.string(),
    solved_at: z.string().nullable(),

    lastName: z.string(),
    firstName: z.string(),
    email: z.string(),

    type: z.string(),
    title: z.string(),  
    description: z.string(),
    date: z.string(),

    severity: z.string(),
    location: z.string(),
    coordinates: z.object({
        lat: z.number(),
        lng: z.number()
    }),
})

export const IssueMessagePub = z.object({

})

export const VotePub = z.object({

})