import z from "zod";

export const UserDB = z.object({
    id: z.string(),
    username: z.string(),
    password: z.string(),
    email: z.string().email(),
    createdAt: z.date(),
});

export const UserRegister = z.object({
    firstName: z.string().min(3).max(20),
    lastName: z.string().min(3).max(20),
    password: z.string().min(8).max(30),
    email: z.string().email(),
});

export const UserLogin = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(30),
});