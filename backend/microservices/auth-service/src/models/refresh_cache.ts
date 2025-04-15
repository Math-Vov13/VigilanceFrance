import {randomBytes} from "node:crypto";
import { redisClient } from "./redis-connector";

const CACHE_DAYS = 7

export type cache_content = {
    id: string,
    token: string,
    end: string
}


export async function cacheToken(user_id: string, access_token: string): Promise<string> {
    const token_id = randomBytes(256).toString("hex");
    await redisClient.set(`token:${token_id}`, JSON.stringify({
        "id": user_id,
        "token": access_token,
        "end": new Date( new Date().getMilliseconds() * CACHE_DAYS * 24 * 60 * 60 * 1000 ).toISOString()
    }), { EX: CACHE_DAYS * 24 * 60 * 60 }); // Cache for 7 days

    return token_id;
}

export async function getTokenfromCache(token_id: string) : Promise<cache_content | null> {
    const token = await redisClient.get(`token:${token_id}`);
    if (! token) {
        return null;
    }

    return JSON.parse(token);
}

export async function deleteCacheToken(token_id: string) {
    await redisClient.del(`token:${token_id}`);
}