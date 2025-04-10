import { z } from "zod";
import { voteDB } from "../schemas/votes_sc";
import { solvedVoteDB } from "../schemas/solved_sc";
import { getIssue_byId } from "./marker_db";

const fake_db: z.infer<typeof voteDB>[] = [];


export async function getSolvedVote_byUser(user_id: string, issue_id: string): Promise<z.infer<typeof solvedVoteDB> | null> {
    const vote = fake_db.find((vote) => vote.user_id === user_id && vote.issue_id === issue_id);
    return vote || null;
}

export async function getSolvedVotes_byIssueId(issue_id: string): Promise<z.infer<typeof solvedVoteDB>[]> {
    const result = [];
    for (const vote of fake_db) {
        if (vote.issue_id === issue_id) {
            result.push(vote);
        }
    }

    return result;
}

export async function createSolvedVote(user_id: string, issue_id: string): Promise<z.infer<typeof solvedVoteDB> | null> {
    if (await getSolvedVote_byUser(user_id, issue_id) !== null) { // User can't create more than 1 vote per Issue
        return null;
    }

    const data = {
        id: crypto.randomUUID(),
        user_id: user_id,
        issue_id: issue_id,

        date: new Date()
    }

    fake_db.push(data);
    return data;
}

export async function removeSolvedVote(user_id: string, issue_id: string): Promise<any> {
    const vote = await getSolvedVote_byUser(user_id, issue_id);
    if (!vote) {
        return {
            "success": false,
            "message": "You didn't vote on this Issue!",
            "status": 404
        }
    }

    const issue = await getIssue_byId(vote.issue_id);
    if (!vote) {
        return { // Unexpected Error ?!!
            "success": false,
            "message": "Internal Server Error",
            "status": 500
        }
    }

    if (issue?.reporterID === user_id) {
        return {
            "success": false,
            "message": "The owner of the Issue cannot remove his vote!",
            "status": 409
        }
    }

    return {
        "success": true,
    }
}