import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    lastName: string;
    firstName: string;
    email: string;
    password?: string; // Optional for OAuth users
    profileImage?: string;
    authProvider: 'local' | 'google' | 'github';
    created_at: Date;
}

const user_schema = new Schema({
    lastName: { type: String, required: false, default: '' },
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Not required for OAuth
    profileImage: { type: String, required: false },
    authProvider: { 
        type: String, 
        required: true,
        enum: ['local', 'google', 'github'],
        default: 'local' // Default to 'local' for regular registrations
    },
    created_at: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    }
});

export const UsersModel = mongoose.model<IUser>("accounts", user_schema);