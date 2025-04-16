import { emailQueue } from "../models/queue-system";
import { redisClient } from "../models/redis-connector";
import { IssuePub } from "../schemas/issues";

const CREATE_ISSUE_CHANNEL = "create_issue";
const ISSUE_SOLVED_CHANNEL = "issue_solved";
const DELETE_ISSUE_CHANNEL = "moderated_issue";



redisClient.subscribe(CREATE_ISSUE_CHANNEL, async (data) => {
    console.log("New Issue created !");
    console.log("Data:", data);

    // Envoyer un Mail au créateur de l'issue
    try {
        const parsed_data = await IssuePub.parseAsync(JSON.parse(data));
        await emailQueue.add({
            "emails": [parsed_data.email],
            "title": "New Issue registered!",
            "content": `**${parsed_data.lastName}** ${parsed_data.firstName}, You have created an issue report! :O`,
            "htmlversion": "<b>Test Message</b>"
        })

    } catch (err) {
        console.error(err);
        return;
    }
})

redisClient.subscribe(ISSUE_SOLVED_CHANNEL, async (data) => {
    console.log("New Issue created !");
    console.log("Data:", data);

    // Envoyer un Mail au créateur de l'issue
    try {
        const parsed_data = await IssuePub.parseAsync(JSON.parse(data));
        await emailQueue.add({
            "emails": [parsed_data.email],
            "title": "Your issue has been resolved!",
            "content": `Hello **${parsed_data.lastName}** ${parsed_data.firstName} 👋, You're issue (${parsed_data.id}) has been resolved today. Have a nice day!`,
            "htmlversion": "<b>Test Message</b>"
        })

    } catch (err) {
        console.error(err);
        return;
    }
})

redisClient.subscribe(DELETE_ISSUE_CHANNEL, async (data) => {
    console.log("Issue moderated!");
    console.log("Data:", data);

    // Envoyer un Mail au créateur de l'issue
    try {
        const parsed_data = await IssuePub.parseAsync(JSON.parse(data));
        await emailQueue.add({
            "emails": [parsed_data.email],
            "title": "Your issue has been deleted!",
            "content": `Hello **${parsed_data.lastName}** ${parsed_data.firstName} 👋, You're issue (${parsed_data.id}) has been deleted by our team. Have a nice day!`,
            "htmlversion": "<b>Test Message</b>"
        })

    } catch (err) {
        console.error(err);
        return;
    }
})