import Bull from "bull";
import { z } from "zod";
import { email_queue_schema } from "../schemas/queues";


export const emailQueue = new Bull<z.infer<typeof email_queue_schema>>('email_queue', {
    redis: { host: process.env.REDIS_HOST || 'localhost', port: Number(process.env.REDIS_PORT) || 6379, password: process.env.REDIS_PSWD || "mypassword" },
    limiter: {
        max: 100,
        duration: 10 *1000
    }
})

emailQueue.on("completed", (job, result) => {
    console.log("Job completed:", result);
})

emailQueue.on("failed", (job, err) => {
    console.error("Job failed:", err);
})


// export const smsQueue = new Bull('sms_queue', {
//     redis: { host: process.env.REDIS_HOST || 'localhost', port: Number(process.env.REDIS_PORT) || 6379, password: process.env.REDIS_PSWD || "mypassword" }
// })

// smsQueue.on("completed", (job, result) => {
//     console.log("Job completed:", result);
// })

// smsQueue.on("failed", (job, err) => {
//     console.error("Job failed:", err);
// })