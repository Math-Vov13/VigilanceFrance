import z from "zod";


export const MarkerDB = z.object({
    id: z.string(),
    reporterID: z.string(),
    solved_at: z.date().nullable(),

    type: z.string(),
    title: z.string(),  
    description: z.string(),
    date: z.date(),

    severity: z.string(),
    location: z.string(),
    coordinates: z.object({
        lat: z.number(),
        lon: z.number()
    }),
})

export const IssueCreate = z.object({
    type: z.string().min(6),
    title: z.string().min(6),
    description: z.string().min(6),

    severity: z.string().min(6),
    location: z.string().min(6),
    coordinates: z.object({
        lat: z.number().positive().or( z.number().negative() ),
        lon: z.number().positive().or( z.number().negative() )
    }),
})