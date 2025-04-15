import mongoose, { Document, Schema } from "mongoose";


export interface IMessage extends Document {
    issue_id: string;

    content: [
        {
            user_id: string;
            lastName: string;
            firstName: string;
            message: string;
            created_at: Date;
        }
    ]

    created_at: Date;
}

const messageSchema = new Schema({
    user_id: { type: String, required: true },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    message: { type: String, required: true },
    created_at: {
        type: Date,
        default: Date.now,
        immutable: true,
    }
})

const messagesSchema = new Schema({
    issue_id: { type: String, required: true, immutable: true },
    content: [messageSchema],

    created_at: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
});

export const MessagesModel = mongoose.model<IMessage>("messages", messagesSchema);