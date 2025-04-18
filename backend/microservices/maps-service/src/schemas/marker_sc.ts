import z from "zod";


export const MarkerDB = z.object({
    id: z.string(),
    reporterID: z.string(),

    type: z.string(),
    title: z.string(),  
    description: z.string(),
    date: z.date(),

    severity: z.string(),
    location: z.string(),
    coordinates: z.object({
        lat: z.number(),
        long: z.number()
    }),
})

export const IssueCreate = z.object({
    type: z.string(),
    title: z.string(),
    description: z.string(),

    severity: z.string(),
    location: z.string(),
    coordinates: z.object({
        lat: z.number(),
        long: z.number()
    }),
})