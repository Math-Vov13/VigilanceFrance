import z from "zod";


export const schema_pos = z.object({
    lat: z.number().positive().or( z.number().negative() ),
    lng: z.number().positive().or( z.number().negative() )
});