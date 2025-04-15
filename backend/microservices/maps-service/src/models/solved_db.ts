import { z } from "zod";
import { voteDB } from "../schemas/votes_sc";
import { solvedVoteDB } from "../schemas/solved_sc";
import { getIssue_byId } from "./marker_db";
import { IIssue, IssuesModel } from "../schemas/mongo_issues_sc";

const fake_db: z.infer<typeof voteDB>[] = [];


export async function getSolvedVote_byUser(user_id: string, issue_id: string): Promise<any | null> {
    try {
        const issue = await IssuesModel.findById(issue_id);
        if (!issue) return null;
        return issue.solved.find(vote => vote.user_id === user_id);

    } catch (err) {
        console.log("NOT FOUND:", err);
        return null;
    }

    // const vote = fake_db.find((vote) => vote.user_id === user_id && vote.issue_id === issue_id);
    // return vote || null;
}

export async function getSolvedVotes_byIssueId(issue_id: string): Promise<any | null> {
    try {
        const issue = await IssuesModel.findById(issue_id, { solved: 1 })
        return issue;

    } catch (err) {
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

export async function createSolvedVote(user_id: string, issue_id: string): Promise<IIssue | null> {
    try {
        // Trouvez l'issue par son ID
        const issue = await IssuesModel.findById(issue_id);

        if (!issue) {
            return null;
        }

        // Vérifiez si l'utilisateur a déjà voté
        const hasVoted = issue.solved.some(vote => vote.user_id === user_id);

        if (hasVoted) {
            return null;
        }

        // Ajoutez un vote au document spécifié
        issue.solved.push({
            user_id: user_id,
            created_at: new Date()
        });

        // Enregistrez le document mis à jour
        const updatedIssue = await issue.save();
        return updatedIssue;

    } catch (err) {
        console.log("CONFLICT:", err);
        return null;
    }

    // if (await getSolvedVote_byUser(user_id, issue_id) !== null) { // User can't create more than 1 vote per Issue
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

export async function removeSolvedVote(user_id: string, issue_id: string): Promise<removeVote_status> {
    try {
        const vote = await getSolvedVote_byUser(user_id, issue_id);
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

        // Delete Vote
        issue.solved = issue.solved.filter(vote => vote.user_id !== user_id);
        await issue.save();
        return {
            success: true,
            message: "Vote removed successfully",
            status: 200
        };

    } catch (err) {
        console.log("CONFLICT:", err);
        return {
            success: false,
            message: "Internal Server Error",
            status: 500
        };
    }
    // const vote = await getSolvedVote_byUser(user_id, issue_id);
    // if (!vote) {
    //     return {
    //         "success": false,
    //         "message": "You didn't vote on this Issue!",
    //         "status": 404
    //     }
    // }

    // const issue = await getIssue_byId(vote.issue_id);
    // if (!vote) {
    //     return { // Unexpected Error ?!!
    //         "success": false,
    //         "message": "Internal Server Error",
    //         "status": 500
    //     }
    // }

    // return {
    //     "success": true,
    // }
}