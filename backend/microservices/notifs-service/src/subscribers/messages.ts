import { emailQueue } from "../models/queue-system";
import { redisClient } from "../models/redis-connector";
import { IssueMessagePub } from "../schemas/issues";

const INCOMING_MESSAGE_CHANNEL = "new_message";



redisClient.subscribe(INCOMING_MESSAGE_CHANNEL, async (data) => {
    console.log("New Vote added to your issue!");
    console.log("Data:", data);


    // Envoyer un Mail au créateur de l'issue
    // try {
    //     const parsed_data = await IssueMessagePub.parseAsync(JSON.parse(data));
    //     await emailQueue.add({
    //         "emails": [parsed_data.email],
    //         "title": "New Issue registered!",
    //         "content": `**${parsed_data.lastName}** ${parsed_data.firstName}, You have created an issue report! :O`,
    //         "htmlversion": "<b>Test Message</b>"
    //     })

    // } catch (err) {
    //     console.error(err);
    //     return;
    // }
})