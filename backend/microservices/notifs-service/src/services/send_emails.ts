import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { emailQueue } from "../models/queue-system";
import { z } from "zod";
import { email_queue_schema } from "../schemas/queues";
import Bull from "bull";



const transporter = nodemailer.createTransport({
    "host": process.env.SMTP_HOST_PROVIDER,
    "port": 587,
    "secure": false,
    "auth": {
        "user": process.env.SMTP_USERNAME_PROVIDER,
        "pass": process.env.SMTP_PASSWORD_PROVIDER
    },
})

emailQueue.process(async (job: Bull.Job<z.infer<typeof email_queue_schema>>) => {
    console.log(`Processing job for ${job.data.emails}`);

    const email = await sendEmail(job.data.emails, job.data.title, job.data.content, job.data.htmlversion)
    console.log(`Email sent to ${job.data.emails}`);
    console.debug("Email details:", email);

    return email;
});

export async function sendEmail(emails: Array<string>, subject: string | null, content: string | null, html: string | null): Promise<SMTPTransport.SentMessageInfo | null> {
    try {
        const info = await transporter.sendMail({
            from: '"No-Reply VigilanceFrance 🌍" <no-reply@vgfrance.gouv.fr>',
            to: emails.join(", "),
            subject: subject || "Hello 👋",
            text: content || "Oops, You have received a test email :(",
            html: html || "<b>Hello, World!</b>",
        })

        console.log("Message sent: %s", info.messageId);
        return info;

    } catch (err) {
        console.error("An error occured while trying to send Email:", err);
        return null;
    }
}