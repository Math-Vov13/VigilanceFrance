import z from "zod";

export const UserDB = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string().optional(), // Optional for OAuth
    profileImage: z.string().url().optional(),
    authProvider: z.enum(['local', 'google', 'github']),
    email: z.string().email(),
    createdAt: z.date(),
});

// Regular registration (email/password)
export const UserRegister = z.object({
    firstName: z.string().min(3).max(20),
    lastName: z.string().min(3).max(20),
    password: z.string().min(8).max(30),
    profileImage: z.string().url().optional(),
    // authProvider is NOT in the request body - it defaults to 'local'
    email: z.string().email().min(10).max(30),
});

// OAuth registration (Google/GitHub)
export const UserOAuthRegister = z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    password: z.string().optional(), // No password for OAuth
    profileImage: z.string().url().optional(),
    authProvider: z.enum(['google', 'github']),
    email: z.string().email(),
});

export const UserLogin = z.object({
    email: z.string().email().min(10).max(30),
    password: z.string().min(8).max(30),
});