import { z } from "zod";

export const email_queue_schema = z.object({
    "emails": z.array(z.string().email()),
    "title": z.string(),
    "content": z.string(),
    "htmlversion": z.string().nullable()
})