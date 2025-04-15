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
        lng: z.number()
    }),
})

export const IssueCreate = z.object({
    type: z.enum(["mineur", "moyen", "majeur", "critique"]),
    title: z.string().min(6).max(30),
    description: z.string().min(6).max(100),

    severity: z.enum(["accident", "inondation", "incendie", "vol", "agression", "manifestation", "panne", "pollution", "autre"]),
    location: z.string().min(6).max(80),
    coordinates: z.object({
        lat: z.number().positive().or( z.number().negative() ),
        lng: z.number().positive().or( z.number().negative() )
    }),
})