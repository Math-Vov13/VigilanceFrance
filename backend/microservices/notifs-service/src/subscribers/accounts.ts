import { emailQueue } from "../models/queue-system";
import { redisClient } from "../models/redis-connector";
import { UserPub } from "../schemas/accounts";

const WELCOME_CHANNEL = "new_user";
const NEW_CONNECION_CHANNEL = "new_connection_to_account";
const GOODBYE_CHANNEL = "deleted_user";


redisClient.subscribe(WELCOME_CHANNEL, async (data) => {
    console.log("Nouvel utilisateur! Bienvenue");
    console.log("Data:", data);

    try {
        const parsed_data = await UserPub.parseAsync(JSON.parse(data));
        await emailQueue.add({
            "emails": [parsed_data.email],
            "title": "Welcome from VigilanceFrance!",
            "content":  `Hello **${parsed_data.lastName}** ${parsed_data.firstName}! You've just created your account. Happy to see you :)`,
            "htmlversion": "<b>Test Message</b>"
        })

        // const email = await sendEmail([parsed_data.email], "Welcome from VigilanceFrance!", `Hello **${parsed_data.lastName}** ${parsed_data.firstName}! You've just created your account. Happy to see you :)`)
        
        // console.debug("Email details:", email);

    } catch(err) {
        console.error(err);
        return;
    }
})

redisClient.subscribe(NEW_CONNECION_CHANNEL, async (data) => {
    console.log("L'utilisateur vient de se connecter");
    console.log("Data:", data);

    try {
        const parsed_data = await UserPub.parseAsync(JSON.parse(data));
        await emailQueue.add({
            "emails": [parsed_data.email],
            "title": "Oh. Hello from our Team!",
            "content":  `Hello **${parsed_data.lastName}** ${parsed_data.firstName}! Again ? Take your time to check our Map and see what is the most safest way to go.\n\nI will say us !! :D\n\n\n> Connected on ${parsed_data.address}\n> Account created on ${parsed_data.created_at}`,
            "htmlversion": "<b>Test Message</b>"
        })
        // const email = await sendEmail([parsed_data.email], "Oh. Hello from our Team!", `Hello **${parsed_data.lastName}** ${parsed_data.firstName}! Again ? Take your time to check our Map and see what is the most safest way to go.\n\nI will say us !! :D\n\n\n> Connected on ${parsed_data.address}\n> Account created on ${parsed_data.created_at}`)
        
        // console.debug("Email details:", email);

    } catch(err) {
        console.error(err);
        return;
    }
})

redisClient.subscribe(GOODBYE_CHANNEL, async (data) => {
    console.log("L'utilisateur vient de supprimer son compte :(");
    console.log("Data:", data);

    try {
        const parsed_data = await UserPub.parseAsync(JSON.parse(data));
        await emailQueue.add({
            "emails": [parsed_data.email],
            "title": "You want to live?",
            "content":  `Hello **${parsed_data.lastName}** ${parsed_data.firstName}! You're trying to delete your account.`,
            "htmlversion": "<b>Test Message</b>"
        })

    } catch(err) {
        console.error(err);
        return;
    }
})