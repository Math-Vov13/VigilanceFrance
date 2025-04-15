import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    lastName: string;
    firstName: string;
    email: string;
    password: string;
    created_at: Date;
}

const user_schema = new Schema({
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_at: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    }
})

export const UsersModel = mongoose.model<IUser>("accounts", user_schema);