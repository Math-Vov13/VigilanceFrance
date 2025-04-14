import { z } from "zod";
import { voteDB } from "../schemas/votes_sc";
import { getIssue_byId } from "./marker_db";
import { IIssue, IssuesModel } from "../schemas/mongo_issues_sc";

const fake_db: z.infer<typeof voteDB>[] = [];


export async function getVote_byUser(user_id: string, issue_id: string): Promise<any> {
    try {
        const issue = await IssuesModel.findById(issue_id);
        if (!issue) return null;
        return issue.votes.find(vote => vote.user_id === user_id);

    } catch(err) {
        console.log("NOT FOUND:", err);
        return null;
    }

    // const vote = fake_db.find((vote) => vote.user_id === user_id && vote.issue_id === issue_id);
    // return vote || null;
}

export async function getVotes_byIssueId(issue_id: string): Promise<any | null> {
    try {
        const issue = await IssuesModel.findById(issue_id, { votes: 1 })
        return issue;

    } catch(err) {
        console.log("NOT FOUND:", err);
        return null;
    }
    // const result = [];
    // for (const vote of fake_db) {
    //     if (vote.issue_id === issue_id) {
    //         result.push(vote);
    //     }
    // }

    // return result;
}

export async function createVote(user_id: string, issue_id: string): Promise<IIssue | null> {
    try {
        // Trouvez l'issue par son ID
        const issue = await IssuesModel.findById(issue_id);

        if (!issue) {
            return null;
        }

        // Vérifiez si l'utilisateur a déjà voté
        const hasVoted = issue.votes.some(vote => vote.user_id === user_id);

        if (hasVoted) {
            return null;
        }

        // Ajoutez un vote au document spécifié
        issue.votes.push({
            user_id: user_id,
            created_at: new Date()
        });

        // Enregistrez le document mis à jour
        const updatedIssue = await issue.save();
        return updatedIssue;

    } catch(err) {
        console.log("CONFLICT:", err);
        return null;
    }

    // if (await getVote_byUser(user_id, issue_id) !== null) { // User can't create more than 1 vote per Issue
    //     return null;
    // }

    // const data = {
    //     id: crypto.randomUUID(),
    //     user_id: user_id,
    //     issue_id: issue_id,

    //     date: new Date()
    // }

    // fake_db.push(data);
    // return data;
}

type removeVote_status = {
    success: boolean,
    message: string,
    status: number
}

export async function removeVote(user_id: string, issue_id: string): Promise<removeVote_status> {
    try {
        const vote = await getVote_byUser(user_id, issue_id);
        if (!vote) {
            return {
                success: false,
                message: "You didn't vote on this Issue!",
                status: 404
            };
        }

        const issue = await getIssue_byId(issue_id);
        if (!issue) {
            return {
                success: false,
                message: "Internal Server Error",
                status: 500
            };
        }

        if (issue.reporter_id === user_id) {
            return {
                success: false,
                message: "The owner of the Issue cannot remove his vote!",
                status: 409
            };
        }

        // Delete Vote
        issue.votes = issue.votes.filter(vote => vote.user_id !== user_id);
        await issue.save();
        return {
            success: true,
            message: "Vote removed successfully",
            status: 200
        };

    } catch(err) {
        console.log("CONFLICT:", err);
        return {
            success: false,
            message: "Internal Server Error",
            status: 500
        };
    }
}