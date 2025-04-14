import { redisClient } from "./redis";


// CACHE
export async function cacheIssue(issue_id: string, issue: any) {
    await redisClient.set(`issue:${issue_id}`, JSON.stringify(issue), {
        EX: 60 * 60 * 24 // 1 day
    });
}

export async function cacheVote(issue_id: string, votes: any) {
    await redisClient.set(`votes:${issue_id}`, JSON.stringify(votes), {
        EX: 60 * 60 * 24 // 1 day
    });
}

export async function cacheSolved(issue_id: string, issue: any) {
    await redisClient.set(`solved:${issue_id}`, JSON.stringify(issue), {
        EX: 60 * 60 * 24 // 1 day
    });
}

// GET
export async function getCachedIssue(issue_id: string) {
    const cached = await redisClient.get(`issue:${issue_id}`);
    if (cached) {
        return JSON.parse(cached);
    }
    return null;
}

export async function getCachedVotes(issue_id: string, vote_id: string, user_id: string) {
    const cached = await redisClient.get(`votes:${issue_id}`);
    if (cached) {
        return JSON.parse(cached);
    }
    return null;
}

export async function getCachedSolved(issue_id: string, vote_id: string, user_id: string) {
    const cached = await redisClient.get(`solved:${issue_id}`);
    if (cached) {
        return JSON.parse(cached);
    }
    return null;
}