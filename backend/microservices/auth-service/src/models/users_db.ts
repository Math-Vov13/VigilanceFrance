import { z } from "zod";
import { UserOAuthRegister, UserRegister } from "../schema/users_sc";
import { hashPassword, verifyPassword } from "../security/hash";
import { IUser, UsersModel } from "../schema/mongo_users_sc";

// const fake_db: z.infer<typeof UserDB>[] = []

export type CreateUserInput = 
  | z.infer<typeof UserRegister> 
  | (z.infer<typeof UserOAuthRegister>);

export async function getUserById(id: string): Promise<IUser | null> {
    // const user = fake_db.find((user) => user.id === id);
    // if (! user) {
    //     return null;
    // }
    // return user;

    try {
        const user = await UsersModel.findById(id).exec();
        console.log("User:", user);

        return user;

    } catch (err) {
        console.log("NOT FOUND:", err);
        return null;
    }
}

export async function getUserByEmail(email: z.infer<typeof UserRegister>["email"]) : Promise<IUser | null> {
    // const user = fake_db.find((user) => user.email === email);
    // return user || null;

    try {
        const user = await UsersModel.findOne({ email: email }).exec();
        console.log("User:", user);

        return user;

    } catch (err) {
        console.log("NOT FOUND:", err);
        return null;
    }
}

export async function getUser(email: z.infer<typeof UserRegister>["email"], password: z.infer<typeof UserRegister>["password"]) : Promise<IUser | null> {
    // const user = fake_db.find((user) => user.email === email);
    // if (! user) {
    //     return null;
    // }

    // // Verify password
    // if (await verifyPassword(user.password, password)) {
    //     return user;
    // }

    try {
        // Find User
        const user = await UsersModel.findOne({ email: email }).exec();
        console.log("User:", user);

        // Match Password
        if (await verifyPassword(user?.password as string, password)) {
            return user;
        }

    } catch (err) {
        console.log("NOT FOUND:", err);
        return null;
    }

    return null;
}

// export async function getUser_byemail(email: string): Promise<z.infer<typeof UserDB> | null> {
//     const user = fake_db.find((user) => user.email === email);
//     return user || null;
// }

export async function createUser(user: CreateUserInput): Promise<IUser | null> {
    try {
        // Determine if this is an OAuth user
        const isOAuth = 'authProvider' in user && (user as any).authProvider !== 'local';
        
        // For OAuth users, password can be empty or undefined
        // For local users, password must be hashed
        const hashedPassword = user.password && user.password.length > 0
            ? await hashPassword(user.password)
            : undefined;

        const new_user = await UsersModel.create({
            lastName: user.lastName,
            firstName: user.firstName,
            email: user.email,
            password: hashedPassword,
            profileImage: user.profileImage || undefined,
            authProvider: 'authProvider' in user ? user.authProvider : 'local',
        });
        
        console.log("User created:", new_user.id, new_user.authProvider);
        return new_user;

    } catch (err: any) {
        // Handle duplicate email error
        if (err.code === 11000) {
            console.log("User already exists with email:", user.email);
        } else {
            console.error("Error creating user:", err);
        }
        return null;
    }
}
