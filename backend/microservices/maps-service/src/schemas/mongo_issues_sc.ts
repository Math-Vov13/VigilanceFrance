import mongoose, { Document, Schema } from "mongoose";

export interface IIssue extends Document {
    reporter_id: string;
    solved_at: Date | null;
    type: string;
    title: string;
    description: string;
    severity: string;
    location: string;
    coordinates: {
        lat: number;
        lon: number;
    };
    votes: {
        user_id: string;
        created_at: Date;
    }[];
    solved: {
        user_id: string;
        created_at: Date;
    }[];
    created_at: Date;
}

const voteSchema = new Schema({
    user_id: { type: String, required: true },
    created_at: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
});

const solvedSchema = new Schema({
    user_id: { type: String, required: true, immutable: true },
    created_at: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
});

const issueSchema = new Schema({
    reporter_id: { type: String, required: true, immutable: true },
    solved_at: { type: Date, default: null },

    type: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    severity: { type: String, required: true },

    location: { type: String, required: true },
    coordinates: {
        lat: { type: Number, required: true },
        lon: { type: Number, required: true },
    },

    votes: [voteSchema],
    solved: [solvedSchema],

    created_at: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
});

export const IssuesModel = mongoose.model<IIssue>("issues", issueSchema);