import { redisClient } from "../models/redis-connector";

const VOTE_ADDED_CHANNEL = "new_vote";
const SOLVED_VOTE_ADDED_CHANNEL = "new_solved_vote";



redisClient.subscribe(VOTE_ADDED_CHANNEL, (data) => {
    console.log("New Vote added to your issue!");
    console.log("Data:", data);


    // Envoyer un Mail au créateur de l'issue
    // Envoyer un Mail à celui qui vient de voter
})


redisClient.subscribe(SOLVED_VOTE_ADDED_CHANNEL, (data) => {
    console.log("New Solved Vote added to your issue!");
    console.log("Data:", data);


    // Envoyer un Mail au créateur de l'issue
    // Envoyer un Mail à celui qui vient de voter
})